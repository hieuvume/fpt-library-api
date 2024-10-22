import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { BookTitle } from "modules/book-title/book-title.schema";
import { User } from "modules/user/user.schema";
import { Document, Types } from "mongoose";
import { Factory } from "nestjs-seeder";

export type FeedbackDocument = Feedback & Document;

@Schema()
export class Feedback {

  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Type(() => User)
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'BookTitle', required: true })
  @Type(() => BookTitle)
  book_title: BookTitle;

  @Factory(faker => faker.lorem.sentence({ min: 1, max: 3 }))
  @Prop({ required: true })
  content: string;

  @Factory(faker => faker.number.int({ min: 0, max: 5 }))
  @Prop({ required: true, default: 0 })
  rating: number;

  @Factory(faker => faker.date.recent())
  @Prop({ required: true })
  created_at: Date;

  @Factory(faker => faker.date.recent())
  @Prop({ required: true })
  updated_at: Date;

}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
