import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { Document, ObjectId } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";
export type MembershipDocument = Membership & Document;

@Schema()
export class Membership {

  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

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

  @Prop({ required: true })
  renewal_allowed: boolean;

  @Prop({ required: true })
  hold_allowed: boolean;

  @Prop()
  color: string;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
MembershipSchema.plugin(mongoosePaginate);
