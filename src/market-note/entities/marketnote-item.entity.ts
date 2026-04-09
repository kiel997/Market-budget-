import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MarketNote } from './marketnote.entity';

@Entity()
export class MarketListItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  quantity!: number;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ nullable: true })
  category!: string;

  @ManyToOne(() => MarketNote, note => note.items, { onDelete: 'CASCADE' })
  marketNote!: MarketNote;
}
