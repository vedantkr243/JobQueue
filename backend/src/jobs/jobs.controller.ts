import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateJobDto, UpdateJobStatusDto } from './create-job.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.createJob(dto);
  }

  @Get()
  findAll() {
    return this.jobsService.getJobs();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateJobStatusDto) {
    return this.jobsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.jobsService.deleteJob(id);
  }
}
