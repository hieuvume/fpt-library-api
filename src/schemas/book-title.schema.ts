import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BookTitleDocument = BookTitle & Document;

@Schema()
export class BookTitle {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  brief_content: string;

  @Prop({ type: [Types.ObjectId], ref: "Category" })
  categories: Types.ObjectId[];

  @Prop({ type: [String] })
  author: string[];

  @Prop()
  ISBN: string;

  @Prop({ type: [Types.ObjectId], ref: "Membership" })
  memberships: Types.ObjectId[];

  @Prop({ required: true })
  price: number;
}

export const BookTitleSchema = SchemaFactory.createForClass(BookTitle);
