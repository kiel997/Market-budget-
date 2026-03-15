import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  // OTP / reset password fields
 @Column({ nullable: true })
 resetOtp?: string;

  @Column({ nullable: true })
 resetOtpExpires?: Date;

}
