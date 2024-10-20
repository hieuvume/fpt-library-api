import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { Book } from "modules/book/book.schema";
import { MembershipCard } from "modules/membership-card/membership-card.schema";
import { Role } from "modules/role/role.schema";
import { Document, ObjectId, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {

  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({})
  password: string;

  @Prop({})
  full_name: string;

  @Prop()
  phone_number: string;

  @Prop({ type: Object })
  id_card: object;

  @Prop({ type: Types.ObjectId, ref: MembershipCard.name })
  @Type(() => MembershipCard)
  current_membership_id: MembershipCard;

  @Prop({ type: [Types.ObjectId], ref: Book.name })
  @Type(() => Book)
  borrowed_books: Book[];

  @Prop({ type: Types.ObjectId, ref: Role.name })
  @Type(() => Role)
  role: Role;

  @Prop()
  google_id: string;

  @Prop()
  google_access_token: string;

  @Prop()
  token_expires_at: Date;
  @Prop()
  address: string;
  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };