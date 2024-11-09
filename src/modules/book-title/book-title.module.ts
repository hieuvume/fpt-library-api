import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookTitleService } from "./book-title.service";
import { BookTitleRepository } from "./book-title.repository";
import { BookTitle, BookTitleSchema } from "./book-title.schema";
import { BorrowRecordModule } from "modules/borrow-record/borrow-record.module";
import { BookTitleController } from "./book-title.controller";
import { BookTitleDashboradController } from "./book-title.dashboard.controller";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: BookTitle.name, schema: BookTitleSchema }])],
  controllers: [BookTitleController,BookTitleDashboradController],
  providers: [BookTitleService, BookTitleRepository],
  exports: [BookTitleService, BookTitleRepository],
  
})
export class BookTitleModule { }