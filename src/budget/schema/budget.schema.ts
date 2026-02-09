import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Item, ItemSchema } from './item.schema';

@Schema({ timestamps: true })
export class Budget {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  totalBudget: number;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop({ default: false })
  isExceeded: boolean;

  @Prop({ type: [ItemSchema], default: [] })
  items: Item[];

  @Prop({ default: 0 })
  remaining: number;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);

// ✅ Export the type for TypeScript
export type BudgetDocument = Budget & Document;
