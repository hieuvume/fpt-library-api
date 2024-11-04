import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Factory } from "nestjs-seeder";
import * as mongoosePaginate from "mongoose-paginate-v2";
import { faker } from "@faker-js/faker";

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Factory(() => faker.book.genre())
  @Prop({ required: true })
  title: string;

  @Factory(faker => faker.lorem.sentence({min: 1, max: 3}))
  @Prop()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.plugin(mongoosePaginate);