import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ type: Types.ObjectId, ref: "BookTitle", required: true })
  book_title_id: Types.ObjectId;

  @Prop({ required: true })
  uniqueId: string;

  @Prop({ required: true })
  section: string;

  @Prop({ required: true })
  shelf: string;

  @Prop({ required: true })
  floor: number;

  @Prop({ required: true })
  position: number;

  @Prop({ required: true })
  status: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
