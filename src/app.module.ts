import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MailModule } from "mail/mail.module";
import { AuthModule } from "modules/auth/auth.module";
import { BookModule } from "modules/book/book.module";
import { CategoryModule } from "modules/category/category.module";
import { ResetPasswordModule } from "modules/reset-password/reset-password.module";
import { RoleModule } from "modules/role/role.module";
import { SettingModule } from "modules/setting/setting.module";
import { UserModule } from "modules/user/user.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BookTitleSeeder } from "modules/book-title/book-title.seeder";
import { BookSeeder } from "modules/book/book.seeder";
import { CategorySeeder } from "modules/category/category.seeder";
import { MembershipCardModule } from "modules/membership-card/membership-card.module";
import { MembershipModule } from "modules/membership/membership.module";
import { BookTitleModule } from "modules/book-title/book-title.module";

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
    MembershipCardModule,
    MembershipModule,
    BookTitleModule,
    
  ],
  providers: [
    AppService,
  ],
  controllers: [AppController]
})
export class AppModule { }
