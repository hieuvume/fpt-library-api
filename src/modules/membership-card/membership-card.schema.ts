import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { Membership } from "modules/membership/membership.schema";
import { User } from "modules/user/user.schema";
import { Document, Types } from "mongoose";

export type MembershipCardDocument = MembershipCard & Document;

@Schema()
export class MembershipCard {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Type(() => User)
  user: User;

  @Prop({ type: Types.ObjectId, ref: "Membership", required: true })
  @Type(() => Membership)
  membership: Membership;

  @Prop({ required: true })
  card_number: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({})
  end_date: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  status: string; // active, inactive, expired

  @Prop()
  created_at: Date;
}

export const MembershipCardSchema =
  SchemaFactory.createForClass(MembershipCard);
