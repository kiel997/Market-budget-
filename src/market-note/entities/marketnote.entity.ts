import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MarketListItem } from './marketnote-item.entity';

@Entity()
export class MarketNote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string; // maps from noteName in body

  @Column({ nullable: true })
  template!: string;

  @Column({ default: false })
  stealthMode!: boolean;

  @Column({ nullable: true })
  marketType!: string; // type of market

  @Column({ type: 'decimal', default: 0 })
  estimatedTotal!: number;

  @OneToMany(() => MarketListItem, item => item.marketNote, { cascade: true })
  items!: MarketListItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
