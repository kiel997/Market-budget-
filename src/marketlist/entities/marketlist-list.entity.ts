import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { User } from '../../Users/entity/user.entity';
import { MarketListItem } from './marketlist-item.entity';

@Entity('market_list')
export class MarketList {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  template!: string;

  @Column({ default: false })
  stealthMode!: boolean;

  @Column({ type: 'float', default: 0 })
  estimatedTotal!: number;

  // ✅ ONLY RELATION (NO manual userId column)
  @ManyToOne(() => User, (user) => user.marketLists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => MarketListItem, (item) => item.marketList, {
    cascade: true,
  })
  items!: MarketListItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
