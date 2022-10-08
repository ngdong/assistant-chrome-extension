import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@/entities/user.entity';
import { WorkitemType } from '@/enums/workitem.enum';

@Entity('workitem')
export class WorkitemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: WorkitemType,
    default: WorkitemType.TASK,
  })
  type: WorkitemType;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @RelationId((workitem: WorkitemEntity) => workitem.user)
  userId: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
