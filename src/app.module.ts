import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SettingModule } from "modules/setting/setting.module";
import { BookModule } from "modules/book/book.module";
import { CategoryModule } from "modules/category/category.module";
import { AuthModule } from "modules/auth/auth.module";
import { UserModule } from "modules/user/user.module";
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path'; // For email templates
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'; // Optional for template engines
import { MailModule } from "mail/mail.module";
import { ConfigModule } from "@nestjs/config";
import { ResetPasswordModule } from "modules/reset-password/reset-password.module";
import { RoleModule } from "modules/role/role.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "modules/role/guards/roles.guard";

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
    RoleModule
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AppController]
})
export class AppModule { }
