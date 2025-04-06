import { IsEmail, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 })
  @Length(3, 50)
  username: string;
  @Index()
  @Column({ unique: true })
  @IsEmail()
  email: string;
  @Column({ length: 255 })
  password: string;
  @Column({ default: 'user' })
  role: string;
  @Column({ default: false })
  isVerified: boolean;
  @Index()
  @Column({ nullable: true })
  verificationOtp?: string;
  @Index()
  @Column({ nullable: true })
  verificationExpires?: Date;
  @Index()
  @Column({ nullable: true })
  resetPasswordOtp?: string;
  @Index()
  @Column({ nullable: true })
  resetPasswordExpires?: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
