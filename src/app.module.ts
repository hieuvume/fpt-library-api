import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MailModule } from "mail/mail.module";
import { AuthModule } from "modules/auth/auth.module";
import { BookTitleModule } from "modules/book-title/book-title.module";
import { BookModule } from "modules/book/book.module"; // Ensure BookModule is imported
import { BorrowRecordModule } from "modules/borrow-record/borrow-record.module";
import { CategoryModule } from "modules/category/category.module";
import { MembershipCardModule } from "modules/membership-card/membership-card.module";
import { MembershipModule } from "modules/membership/membership.module";
import { NewsModule } from "modules/news/news.module";
import { ResetPasswordModule } from "modules/reset-password/reset-password.module";
import { RoleModule } from "modules/role/role.module";
import { SettingModule } from "modules/setting/setting.module";
import { UserModule } from "modules/user/user.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FeedbackModule } from "modules/feedback/feedback.module";
import { PaymentModule } from "modules/payment/payment.module";
import { ScheduleModule } from "@nestjs/schedule";
import { NotificationModule } from "modules/notification/notification.module";
import { DashboardModule } from "modules/dashboard/dashboard.module";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot("mongodb://localhost:27017", {
      user: "root",
      dbName: "library",
      pass: "123456",
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    MailModule,
    SettingModule,
    BookModule,
    CategoryModule,
    UserModule,
    AuthModule,
    ResetPasswordModule,
    RoleModule,
    BookTitleModule,
    BorrowRecordModule,
    NewsModule,
    MembershipModule,
    MembershipCardModule,
    FeedbackModule,
    PaymentModule,
    NotificationModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
