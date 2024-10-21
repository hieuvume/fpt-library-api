import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BorrowRecord, BorrowRecordSchema } from "./borrow-record.schema";
import { BorrowRecordRepository } from "./borrow-record.repository";
import { BorrowRecordService } from "./borrow-record.service";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: BorrowRecord.name, schema: BorrowRecordSchema }])],
  controllers: [],
  providers: [BorrowRecordService, BorrowRecordRepository],
  exports: [BorrowRecordService, BorrowRecordRepository]
})
export class BorrowRecordModule { }