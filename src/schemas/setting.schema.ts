import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema()
export class Setting {
  @Prop({ required: true })
  max_borrow_duration: number;

  @Prop({ required: true })
  overdue_penalty_per_day: number;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);