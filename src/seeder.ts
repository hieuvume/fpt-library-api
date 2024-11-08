import { seeder } from "nestjs-seeder";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "modules/category/category.schema";
import {
  BookTitle,
  BookTitleSchema,
} from "modules/book-title/book-title.schema";
import { Book, BookSchema } from "modules/book/book.schema";
import { CategorySeeder } from "modules/category/category.seeder";
import { BookTitleSeeder } from "modules/book-title/book-title.seeder";
import { BookSeeder } from "modules/book/book.seeder";
import { Role, RoleSchema } from "modules/role/role.schema";
import {
  BorrowRecord,
  BorrowRecordSchema,
} from "modules/borrow-record/borrow-record.schema";
import { UserSeeder } from "modules/user/user.seeder";
import { User, UserSchema } from "modules/user/user.schema";
import { BorrowRecordSeeder } from "modules/borrow-record/borrow-record.seeder";
import { News, NewsSchema } from "modules/news/news.schema";
import { NewsSeeder } from "modules/news/news.seeder";
import { Feedback, FeedbackSchema } from "modules/feedback/feedback.schema";
import { FeedbackSeeder } from "modules/feedback/feedback.seeder";
import { MembershipSeeder } from "modules/membership/membership.seeder";
import { Membership, MembershipSchema } from "modules/membership/membership.schema";
import { MembershipCard, MembershipCardSchema } from "modules/membership-card/membership-card.schema";
import { MembershipCardSeeder } from "modules/membership-card/membership-card.seeder";
import { Payment, PaymentSchema } from "modules/payment/payment.schema";
import { PaymentSeeder } from "modules/payment/payment.seeder";
import { Setting, SettingSchema } from "modules/setting/setting.schema";
import { SettingSeeder } from "modules/setting/setting.seeder";
import { RoleSeeder } from "modules/role/role.seeder";

seeder({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017", {
      user: "root",
      dbName: "library",
      pass: "123456",
    }),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: BookTitle.name, schema: BookTitleSchema },
      { name: Book.name, schema: BookSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: BorrowRecord.name, schema: BorrowRecordSchema },
      { name: News.name, schema: NewsSchema },
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: MembershipCard.name, schema: MembershipCardSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
  ],
}).run([
  SettingSeeder,
  RoleSeeder,
  UserSeeder,
  MembershipSeeder,
  MembershipCardSeeder,
  CategorySeeder,
  BookTitleSeeder,
  BookSeeder,
  BorrowRecordSeeder,
  NewsSeeder,
  FeedbackSeeder,
  PaymentSeeder,
]);
