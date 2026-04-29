import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MarketNote } from './marketnote.entity';

@Entity()
export class MarketNoteItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  quantity!: number;

  @Column({ type: 'decimal' })
  estimatedPrice!: number; // ✅ renamed

  @Column({ type: 'decimal', default: 0 })
  actualPrice!: number; // ✅ new field

  @Column({ nullable: true })
  category!: string;

  @ManyToOne(() => MarketNote, note => note.items, {
    onDelete: 'CASCADE',
  })
  marketNote!: MarketNote;
}
