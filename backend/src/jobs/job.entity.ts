import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @Column()
  title!: string;

  @Column()
  type!: string;

  @Column({ type: 'varchar', length: 20 })
  status!: 'pending' | 'running' | 'completed' | 'failed';

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
