import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MarketListItem } from './marketlist-item.entity';

@Entity('market_list') // ✅ good practice
export class MarketList {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  template!: string;

  @Column({ default: false })
  stealthMode!: boolean; // 

  @Column({ type: 'decimal', default: 0 })
  estimatedTotal!: number;

  @OneToMany(
    () => MarketListItem,
    (item) => item.marketList,
    {
      cascade: true,
      eager: true, // ✅ auto load items
    },
  )
  items!: MarketListItem[];

  // ✅ created timestamp
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  // ✅ updated timestamp (important)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
