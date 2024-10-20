import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResetPasswordDocument = ResetPassword & Document;

@Schema()
export class ResetPassword {
  
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop()
  created_at: Date;

  @Prop()
  expiresAt: Date;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);