import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MarketListItem} from './marketlist-item.entity';

@Entity()
export class MarketList {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  template: string;

  @Column({ default: false })
  stealthMode: boolean;

  @Column({ type: 'decimal', default: 0 })
  estimatedTotal: number;

  @OneToMany(() => MarketListItem, (item) => item.list, { cascade: true })
  items: MarketListItem[];
}
