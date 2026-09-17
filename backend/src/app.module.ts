import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './jobs/job.entity';
import { JobsController } from './jobs/jobs.controller';
import { JobsService } from './jobs/jobs.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true,
  ssl: { rejectUnauthorized: false },
}),
    TypeOrmModule.forFeature([Job]),
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class AppModule {}
