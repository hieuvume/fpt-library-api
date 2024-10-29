import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { Membership } from "modules/membership/membership.schema";
import { User } from "modules/user/user.schema";
import { Document, Types } from "mongoose";

export type MembershipCardDocument = MembershipCard & Document;

@Schema()
export class MembershipCard {

  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Type(() => User)
  user: User;

  @Prop({ type: Types.ObjectId, ref: "Membership", required: true })
  @Type(() => Membership)
  membership: Membership;

  @Prop({ required: true, enum: ["monthly", "annual"] })
  billing_cycle: string;

  @Prop({ required: true })
  card_number: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({})
  end_date: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  total_borrowed: number;

  @Prop({ required: true, enum: ["active", "inactive", "expired"] })
  status: string; // active, inactive, expired

  @Prop({ required: true, default: new Date() })
  created_at: Date;
}

export const MembershipCardSchema =
  SchemaFactory.createForClass(MembershipCard);
