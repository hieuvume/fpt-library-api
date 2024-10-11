import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MembershipCardDocument = MembershipCard & Document;

@Schema()
export class MembershipCard {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Membership", required: true })
  membership_id: Types.ObjectId;

  @Prop({ required: true })
  card_number: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  status: string;

  @Prop()
  created_at: Date;
}

export const MembershipCardSchema =
  SchemaFactory.createForClass(MembershipCard);
