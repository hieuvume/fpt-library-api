import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Factory } from "nestjs-seeder";
import { Category } from "modules/category/category.schema";
import { Membership } from "modules/membership/membership.schema";
import { Transform } from "class-transformer";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Feedback } from "modules/feedback/feedback.schema";
export type BookTitleDocument = BookTitle & Document;

@Schema()
export class BookTitle {

  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;
  
  // Tiêu đề sách sẽ là chuỗi từ 2 đến 5 từ
  @Factory((faker) => {
    const title = faker.lorem.words({ min: 5, max: 20 });
    return title.charAt(0).toUpperCase() + title.slice(1);
  })
  @Prop({ required: true })
  title: string;

  // Mô tả dài từ 1 đến 3 câu
  @Factory(faker => faker.lorem.sentences({ min: 5, max: 10 }))
  @Prop()
  description: string;

  // Nội dung ngắn gọn sẽ là 1 câu
  @Factory(faker => faker.lorem.sentence({ min: 1, max: 3 }))
  @Prop()
  brief_content: string;

  // Hình ảnh bìa sách từ Picsum với kích thước tùy chỉnh
  @Factory(faker => faker.image.urlPicsumPhotos({ width: 355, height: 480 }))
  @Prop()
  cover_image: string;

  @Prop({ type: [Types.ObjectId], ref: Category.name })
  categories: Category[];

  @Prop({ type: [Types.ObjectId], ref: Feedback.name })
  feedbacks: Feedback[];

  @Factory(faker => {
    const authorNum = faker.number.int({ min: 1, max: 3 });
    return Array.from({ length: authorNum }, () => faker.person.fullName());
  })
  @Prop({ type: [String] })
  author: string[];

  @Factory(faker => faker.string.numeric({ length: 13 }))
  @Prop()
  ISBN: string;

  @Prop({ type: [Types.ObjectId], ref: Membership.name })
  memberships: Membership[];

  // Giá sách từ 50,000 đến 200,000 VND (điều chỉnh để phù hợp với giá sách thực tế)
  @Factory(faker => faker.number.int({ min: 50000, max: 200000 }))
  @Prop({ required: true })
  price: number;

  // Số lần mượn từ 0 đến 100, phản ánh tần suất mượn sách
  @Factory(faker => faker.number.int({ min: 0, max: 100 }))
  @Prop()
  times_borrowed: number;

}

export const BookTitleSchema = SchemaFactory.createForClass(BookTitle);

BookTitleSchema.plugin(mongoosePaginate);