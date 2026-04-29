import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { MarketList } from './marketlist-list.entity';

@Entity()
export class MarketListItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  quantity!: number;

  @Column('float')
  price!: number;

  @Column({ nullable: true })
  category?: string;

  @ManyToOne(() => MarketList, (list) => list.items, {
    onDelete: 'CASCADE',
  })
  marketList!: MarketList;
}
