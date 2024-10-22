import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { Document } from "mongoose";
import { Factory } from "nestjs-seeder";

export type NewsDocument = News & Document;

@Schema()
export class News {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Factory((faker) => faker.lorem.sentence())
  @Prop({ required: true })
  title: string;

  @Factory((faker) => faker.lorem.paragraph())
  @Prop()
  brief_content: string;

  @Factory((faker) => faker.lorem.slug())
  @Prop({ unique: true, required: true })
  slug: string;

  @Factory((faker) => faker.lorem.sentence())
  @Prop()
  content: string;

  @Factory((faker) => faker.image.urlPicsumPhotos())
  @Prop({ required: true })
  thumbnail: string;

  @Factory((faker) => true)
  @Prop({ default: false })
  published: boolean;

  @Factory(() => new Date())
  @Prop()
  created_at: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
