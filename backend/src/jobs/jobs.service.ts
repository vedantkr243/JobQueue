import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity';

const VALID_STATUSES = ['pending', 'running', 'completed', 'failed'] as const;
type JobStatus = (typeof VALID_STATUSES)[number];

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async createJob(data: { id: string; title: string; type: string }) {
    const job = this.jobRepository.create({
      id: data.id,
      title: data.title,
      type: data.type,
      status: 'pending',
    });

    return this.jobRepository.save(job);
  }

  async getJobs() {
    return this.jobRepository.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, newStatus: JobStatus) {
    if (!VALID_STATUSES.includes(newStatus)) {
      throw new BadRequestException('Invalid status value.');
    }

    const job = await this.jobRepository.findOneBy({ id });
    if (!job) {
      throw new NotFoundException('Job not found.');
    }

    const allowed = this.isTransitionAllowed(job.status, newStatus);
    if (!allowed) {
      throw new BadRequestException(`Job status cannot change from ${job.status} to ${newStatus}.`);
    }

    if (job.status === 'pending' && newStatus === 'running') {
      // Only update the job when its current status is still pending. This prevents two simultaneous requests from both changing the same job from pending to running.
      const updated = await this.jobRepository
        .createQueryBuilder()
        .update(Job)
        .set({ status: 'running' })
        .where('id = :id', { id })
        .andWhere('status = :status', { status: 'pending' })
        .execute();

      if (updated.affected === 0) {
        throw new ConflictException('Job status was changed by another request.');
      }

      return this.jobRepository.findOneBy({ id });
    }

    job.status = newStatus;
    return this.jobRepository.save(job);
  }

  async deleteJob(id: string) {
    const result = await this.jobRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Job not found.');
    }

    return { success: true };
  }

  private isTransitionAllowed(current: string, next: JobStatus) {
    const allowedMap: Record<string, JobStatus[]> = {
      pending: ['running', 'failed'],
      running: ['completed', 'failed'],
      completed: [],
      failed: [],
    };

    return allowedMap[current]?.includes(next) ?? false;
  }
}
