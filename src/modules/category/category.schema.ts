import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Factory } from "nestjs-seeder";

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Factory(faker => faker.lorem.words(2))
  @Prop({ required: true })
  title: string;

  @Factory(faker => faker.lorem.sentence())
  @Prop()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
