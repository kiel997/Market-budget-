import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GroceryItem } from './grocery-item.entity';

@Entity()
export class GroceryList {
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

  @OneToMany(() => GroceryItem, (item) => item.list, { cascade: true })
  items: GroceryItem[];
}
