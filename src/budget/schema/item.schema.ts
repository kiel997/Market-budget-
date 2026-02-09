import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: true })
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop()
  category?: string;

  @Prop({ default: false })
  isPurchased: boolean;

  @Prop({ default: Date.now })
  addedAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
