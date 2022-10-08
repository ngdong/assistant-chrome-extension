import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  BeforeUpdate,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { Exclude, instanceToPlain } from 'class-transformer';
import { IRegisterDto } from '@/modules/auth/auth.interface';
import { UserRole } from '@/enums/user.enum';
import { WorkitemEntity } from './workitem.entity';

@Entity('user')
@Unique(['username'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GHOST,
  })
  role: UserRole;

  @OneToMany(() => WorkitemEntity, (workitem) => workitem.user)
  workitems: WorkitemEntity[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  public forEntity(input: IRegisterDto) {
    this.username = input.username;
    this.password = input.password;
    this.role = input.role;
  }

  public toJSON() {
    return instanceToPlain(this);
  }

  public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }

  @Exclude({ toPlainOnly: true })
  private tempPassword: string;

  @AfterLoad()
  loadTempPassword = (): void => {
    this.tempPassword = this.password;
  };

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword = (): void => {
    if (this.tempPassword !== this.password) {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  };
}
