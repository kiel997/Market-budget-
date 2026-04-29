import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { MarketList } from '../../marketlist/entities/marketlist-list.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  resetOtp?: string;

  @Column({ nullable: true })
  resetOtpExpires?: Date;

  @OneToMany(() => MarketList, (list) => list.user)
  marketLists!: MarketList[];
}
