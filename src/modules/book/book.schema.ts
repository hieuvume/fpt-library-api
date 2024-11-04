import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Factory } from "nestjs-seeder";
import { BookTitle } from "modules/book-title/book-title.schema";
import { Transform } from "class-transformer";
import * as mongoosePaginate from "mongoose-paginate-v2";

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Factory(() => new Types.ObjectId())
  @Prop({ type: Types.ObjectId, ref: "BookTitle", required: true })
  book_title: BookTitle;

  @Factory((faker) => faker.string.uuid())
  @Prop({ required: true })
  uniqueId: string;

  @Factory((faker) => faker.string.alphanumeric(3))
  @Prop({ required: true })
  section: string;

  @Factory((faker) => faker.string.alphanumeric(3))
  @Prop({ required: true })
  shelf: string;

  @Factory((faker) => faker.number.int({ min: 1, max: 5 }))
  @Prop({ required: true })
  floor: number;

  @Factory((faker) => faker.number.int({ min: 1, max: 20 }))
  @Prop({ required: true })
  position: number;

  @Factory((faker) =>
    faker.helpers.arrayElement(["available", "borrowed", "losted"])
  )
  @Prop({ required: true, enum: ["available", "borrowed", "losted"] })
  status: string; // [available, borrowed, losted]

  @Factory((faker) => faker.number.int({ min: 1, max: 10 }))
  @Prop()
  times_borrowed: number;

  @Factory((faker) => faker.date.past())
  @Prop()
  created_at: Date;

  @Factory((faker) => faker.date.recent())
  @Prop()
  updated_at: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.plugin(mongoosePaginate);
