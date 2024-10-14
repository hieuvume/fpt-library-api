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

  @Prop()
  color: string;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
