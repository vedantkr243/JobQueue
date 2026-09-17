import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './jobs/job.entity';
import { JobsController } from './jobs/jobs.controller';
import { JobsService } from './jobs/jobs.service';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/job_queue';
const useSupabaseSsl = databaseUrl.includes('supabase.com');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: databaseUrl,
      autoLoadEntities: true,
      synchronize: true,
      ssl: useSupabaseSsl ? { rejectUnauthorized: false } : false,
    }),
    TypeOrmModule.forFeature([Job]),
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class AppModule {}
