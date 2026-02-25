import {Entity, PrimaryGeneratedColumn, Column, OneToMany,} from 'typeorm';
import { Item } from './item.entity';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal')
  totalBudget: number;

  @Column({ default: 0 })
  totalSpent: number;

  @Column({ default: false })
  isExceeded: boolean;

  @Column({ default: 0 })
  remaining: number;

  @OneToMany(() => Item, (item) => item.budget, {
    cascade: true,
  })
  items: Item[];
}
