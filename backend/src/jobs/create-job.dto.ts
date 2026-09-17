import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;
}

export class UpdateJobStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'running', 'completed', 'failed'])
  status!: 'pending' | 'running' | 'completed' | 'failed';
}
