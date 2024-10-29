import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  transaction_id: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  payment_method: string;

  @Prop({ required: true })
  payment_type: string;

  @Prop({ required: true })
  payment_date: Date;

  @Prop({ required: true, enum: ["pending", "completed", "failed"] })
  payment_status: string;

  @Prop({ type: Types.ObjectId, ref: "MembershipCard" })
  membership_card_id: Types.ObjectId;

  @Prop()
  details: string;

  @Prop()
  created_at: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
