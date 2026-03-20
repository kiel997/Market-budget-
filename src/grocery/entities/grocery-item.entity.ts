import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { GroceryList } from './grocery-list.entity';

@Entity()
export class GroceryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column('decimal')
  price: number;

  @ManyToOne(() => GroceryList, (list) => list.items, {
    onDelete: 'CASCADE',
  })
  list: GroceryList;
}
