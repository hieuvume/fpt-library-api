import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MembershipDocument = Membership & Document;

@Schema()
export class Membership {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price_monthly: number;

  @Prop({ required: true })
  price_yearly: number;

  @Prop({ required: true })
  max_borrow_days: number;

  @Prop({ required: true })
  max_borrow_books_per_time: number;

  @Prop({ required: true })
  max_reserve_books_per_montly: number;

  @Prop()
  color: string;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
