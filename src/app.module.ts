import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SettingModule } from "modules/setting/setting.module";
import { BookModule } from "modules/book/book.module";
import { CategoryModule } from "modules/category/category.module";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017", {
      user: 'root',
      dbName: 'library',
      pass: '123456',
    }),
    SettingModule,
    BookModule,
    CategoryModule
  ],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule { }
