import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  full_name: string;

  @Prop()
  phone_number: string;

  @Prop({ type: Object })
  id_card: object;

  @Prop({ type: Types.ObjectId, ref: "MembershipCard" })
  current_membership_id: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: "Book" })
  borrowed_books: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: "Role" })
  role_id: Types.ObjectId;

  @Prop()
  google_id: string;

  @Prop()
  google_access_token: string;

  @Prop()
  token_expires_at: Date;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
