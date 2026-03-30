import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MarketList } from './marketlist-list.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class MarketListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({
    type: 'decimal',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  price: number;

  @Column({ nullable: true })
  category: string;

  @ManyToOne(() => MarketList, (list) => list.items, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  marketList: MarketList;
}
