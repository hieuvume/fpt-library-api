import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Factory } from "nestjs-seeder";
import { Category } from "modules/category/category.schema";
import { Membership } from "modules/membership/membership.schema";
import { Transform } from "class-transformer";

export type BookTitleDocument = BookTitle & Document;

@Schema()
export class BookTitle {

  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;
  
  @Factory(faker => faker.lorem.words(3))
  @Prop({ required: true })
  title: string;

  @Factory(faker => faker.lorem.sentences(2))
  @Prop()
  description: string;

  @Factory(faker => faker.lorem.sentences(1))
  @Prop()
  brief_content: string;

  @Factory(faker => faker.image.urlPicsumPhotos({ width: 355, height: 480 }))
  @Prop()
  cover_image: string;

  @Factory(() => [new Types.ObjectId(), new Types.ObjectId()])
  @Prop({ type: [Types.ObjectId], ref: Category.name })
  categories: Category[];

  @Factory(faker => [faker.person.fullName()])
  @Prop({ type: [String] })
  author: string[];

  @Factory(faker => faker.string.uuid())
  @Prop()
  ISBN: string;

  @Factory(() => [new Types.ObjectId(), new Types.ObjectId()])
  @Prop({ type: [Types.ObjectId], ref: Membership.name })
  memberships: Membership[];

  @Factory(faker => faker.number.int({ min: 10000, max: 50000 }))
  @Prop({ required: true })
  price: number;
}

export const BookTitleSchema = SchemaFactory.createForClass(BookTitle);
