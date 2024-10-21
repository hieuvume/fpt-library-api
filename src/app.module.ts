import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MailModule } from "mail/mail.module";
import { AuthModule } from "modules/auth/auth.module";
import { BookTitleModule } from "modules/book-title/book-title.module";
import { BookTitle, BookTitleSchema } from "modules/book-title/book-title.schema";
import { BookModule } from "modules/book/book.module";
import { BorrowRecordModule } from "modules/borrow-record/borrow-record.module";
import { CategoryModule } from "modules/category/category.module";
import { ResetPasswordModule } from "modules/reset-password/reset-password.module";
import { RoleModule } from "modules/role/role.module";
import { SettingModule } from "modules/setting/setting.module";
import { UserModule } from "modules/user/user.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Book, BookSchema } from "modules/book/book.schema";
import { BorrowRecord, BorrowRecordSchema } from "modules/borrow-record/borrow-record.schema";
import { Category, CategorySchema } from "modules/category/category.schema";
import { Membership, MembershipSchema } from "modules/membership/membership.schema";
import { BookTitleSeeder } from "modules/book-title/book-title.seeder";
import { BookSeeder } from "modules/book/book.seeder";
import { CategorySeeder } from "modules/category/category.seeder";
import { MembershipModule } from "modules/membership/membership.module";
import { MembershipCardModule } from "modules/membership-card/membership-card.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    MongooseModule.forRoot("mongodb://localhost:27017", {
      user: 'root',
      dbName: 'library',
      pass: '123456',
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
    MembershipModule,
    MembershipCardModule,
  ],
  providers: [
    AppService,
  ],
  controllers: [AppController]
})
export class AppModule { }
