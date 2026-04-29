import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MarketNoteItem } from './marketnote-item.entity';

@Entity()
export class MarketNote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 'Untitled' }) // ✅ FIX: prevents DB crash
  title!: string;

  @Column({ nullable: true })
  template?: string;

  @Column({ default: false })
  stealthMode!: boolean;

  @Column({ nullable: true })
  marketName?: string;

  @Column({
    type: 'decimal',
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  estimatedTotal!: number;

  @OneToMany(() => MarketNoteItem, item => item.marketNote, {
    cascade: true,
  })
  items!: MarketNoteItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
