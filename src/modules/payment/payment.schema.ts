import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { MembershipCard } from "modules/membership-card/membership-card.schema";
import { User } from "modules/user/user.schema";
import { Document, Types } from "mongoose";
import { Factory } from "nestjs-seeder";
import { PaymentService } from "./payment.service";
import { Membership } from "modules/membership/membership.schema";

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment {

  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  @Type(() => User)
  user: User;

  @Factory(() => PaymentService.getRandomTransactionId())
  @Prop({ required: true })
  transaction_id: string;
  
  @Prop({ type: Types.ObjectId, required: true, ref: "Membership" })
  @Type(() => Membership)
  membership: Membership

  @Factory((faker) => faker.helpers.arrayElement([1, 3, 6, 12, 24]))
  @Prop({required: true})
  months: number;

  @Factory((faker) => {
    return faker.number.int({ min: 40000, max: 1000000 });
  })
  @Prop({ required: true })
  amount: number;

  @Factory((faker) => faker.helpers.arrayElement(["banking", "momo", "cash"]))
  @Prop({ required: true, enum: ["banking", "cash", "momo"] })
  payment_method: string;

  @Factory((faker) => faker.helpers.arrayElement(["upgrade", "extend"]))
  @Prop({ required: true, enum: ["upgrade", "extend"] })
  payment_type: string;

  @Factory((faker) => faker.helpers.arrayElement(["completed", "failed"]))
  @Prop({ required: true, default: "pending", enum: ["pending", "completed", "failed"] })
  payment_status: string;

  @Prop({ type: Types.ObjectId, ref: "MembershipCard" })
  @Type(() => MembershipCard)
  from: MembershipCard;

  @Prop({ type: Types.ObjectId, ref: "MembershipCard" })
  @Type(() => MembershipCard)
  to: MembershipCard;

  @Factory((faker) => faker.lorem.sentence())
  @Prop()
  details: string;

  @Factory((faker) => {
    const now = new Date();
    const pastYear = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
    return faker.date.between({ from: pastYear, to: now }); 
  })
  @Prop({})
  payment_date: Date;
  @Factory((faker) => {
    const now = new Date();
    const pastYear = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
    return faker.date.between({ from: pastYear, to: now }); 
  })
  @Prop()
  created_at: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.plugin(require("mongoose-paginate-v2"));