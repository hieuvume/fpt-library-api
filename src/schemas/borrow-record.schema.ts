import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BorrowRecordDocument = BorrowRecord & Document;

@Schema()
export class BorrowRecord {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  book_id: Types.ObjectId;

  @Prop({ required: true })
  before_status: string;

  @Prop({ required: true })
  after_status: string;

  @Prop({ required: true })
  borrow_date: Date;

  @Prop({ required: true })
  due_date: Date;

  @Prop()
  return_date: Date;

  @Prop({ required: true })
  is_returned: boolean;

  @Prop()
  penatly_total: number;
}

export const BorrowRecordSchema = SchemaFactory.createForClass(BorrowRecord);