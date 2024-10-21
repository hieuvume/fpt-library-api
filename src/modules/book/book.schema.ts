import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Factory } from "nestjs-seeder";
import { BookTitle } from "modules/book-title/book-title.schema";

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Factory(() => new Types.ObjectId())
  @Prop({ type: Types.ObjectId, ref: BookTitle.name, required: true })
  book_title: BookTitle;

  @Factory(faker => faker.string.uuid())
  @Prop({ required: true })
  uniqueId: string;

  @Factory(faker => faker.string.alphanumeric(3))
  @Prop({ required: true })
  section: string;

  @Factory(faker => faker.string.alphanumeric(3))
  @Prop({ required: true })
  shelf: string;

  @Factory(faker => faker.number.int({ min: 1, max: 5 }))
  @Prop({ required: true })
  floor: number;

  @Factory(faker => faker.number.int({ min: 1, max: 20 }))
  @Prop({ required: true })
  position: number;

  @Factory(() => 'available')
  @Prop({ required: true })
  status: string;

  @Factory(faker => faker.number.int({ min: 1, max: 10 }))
  @Prop()
  times_borrowed: number;

  @Factory(faker => faker.date.past())
  @Prop()
  created_at: Date;

  @Factory(faker => faker.date.recent())
  @Prop()
  updated_at: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
