import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Budget } from './budget.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  quantity: number;

  @Column('decimal')
  unitPrice: number;

  @Column('decimal')
  totalPrice: number; 

  @Column({ nullable: true })
  category?: string;

  @Column({ default: false })
  isPurchased: boolean;

  @CreateDateColumn()
  addedAt: Date;

  @ManyToOne(() => Budget, (budget) => budget.items, { onDelete: 'CASCADE' })
  budget: Budget;
}
