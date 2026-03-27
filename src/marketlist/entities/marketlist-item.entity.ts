import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MarketList } from './marketlist-list.entity';

@Entity()
export class MarketListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column('decimal')
  price: number;

  @ManyToOne(() => MarketList, (list) => list.items, {
    onDelete: 'CASCADE',
  })
  marketList: MarketList;
}
