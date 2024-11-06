import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { BookTitle } from "modules/book-title/book-title.schema";
import { Book } from "modules/book/book.schema";
import { User } from "modules/user/user.schema";
import { Document, Types } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";
import { Factory } from "nestjs-seeder";

export type BorrowRecordDocument = BorrowRecord & Document;

@Schema()
export class BorrowRecord {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
  user: User;

  @Prop({ type: Types.ObjectId, ref: Book.name })
  @Type(() => Book)
  book: Book;

  @Prop({ type: Types.ObjectId, ref: BookTitle.name, required: true })
  @Type(() => BookTitle)
  book_title: BookTitle;

  @Prop({ type: Types.ObjectId, ref: User.name })
  @Type(() => User)
  librarian: User;

  @Factory((faker) =>
    faker.helpers.arrayElement([
      "canceled",
      "rejected",
      "returned",
      "losted",
    ])
  )
  @Prop({
    required: true,
    enum: [
      "pending",
      "holding",
      "borrowing",
      "canceled",
      "rejected",
      "returned",
      "losted",
    ],
  })
  status: string;

  @Factory(() => "")
  @Prop()
  note: string;

  @Factory(() => "")
  @Prop({})
  before_status: string;

  @Factory(() => "Bình thường")
  @Prop({})
  after_status: string;

  @Factory(() => {
    const days = Math.floor(Math.random() * 20) + 10;
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  })
  @Prop({ required: true })
  borrow_date: Date;

  @Factory(() => {
    const days = Math.floor(Math.random() * 10) + 5;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  })
  @Prop()
  due_date: Date;

  @Factory(() => {
    const days = Math.floor(Math.random() * 10) + 5;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  })
  @Factory(() => new Date())
  @Prop()
  return_date: Date;

  @Factory(() => true)
  @Prop({ required: true, default: false })
  is_returned: boolean;

  @Factory(() => 0)
  @Prop()
  penatly_total: number;
}

export const BorrowRecordSchema = SchemaFactory.createForClass(BorrowRecord);
BorrowRecordSchema.plugin(mongoosePaginate);
