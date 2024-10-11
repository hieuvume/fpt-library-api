import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import {
  BookTitleSchema,
  BookSchema,
  BorrowRecordSchema,
  CategorySchema,
  MembershipSchema,
  MembershipCardSchema,
  NotificationSchema,
  PaymentSchema,
  RoleSchema,
  SettingSchema,
  UserSchema,
} from "./schemas";

import {
  BookTitleService,
  BookService,
  BorrowRecordService,
  CategoryService,
  MembershipService,
  MembershipCardService,
  NotificationService,
  PaymentService,
  RoleService,
  SettingService,
  UserService,
} from "./services";

import { HomeController } from "controllers/home.controller";
import { SettingController } from "controllers/setting.controller";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017", {
      user: 'root',
      dbName: 'library',
      pass: '123456',
    }),
    MongooseModule.forFeature([
      { name: "Notification", schema: NotificationSchema },
      { name: "Payment", schema: PaymentSchema },
      { name: "Setting", schema: SettingSchema },
      { name: "Role", schema: RoleSchema },
      { name: "Membership", schema: MembershipSchema },
      { name: "MembershipCard", schema: MembershipCardSchema },
      { name: "Category", schema: CategorySchema },
      { name: "Book", schema: BookSchema },
      { name: "BookTitle", schema: BookTitleSchema },
      { name: "BorrowRecord", schema: BorrowRecordSchema },
      { name: "User", schema: UserSchema },
    ]),
  ],
  providers: [
    AppService,
    BookTitleService,
    BookService,
    BorrowRecordService,
    CategoryService,
    MembershipService,
    MembershipCardService,
    NotificationService,
    PaymentService,
    RoleService,
    SettingService,
    UserService,
  ],
  controllers: [AppController, HomeController, SettingController],
})
export class AppModule {}
