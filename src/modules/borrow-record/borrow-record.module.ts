import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BorrowRecord, BorrowRecordSchema } from "./borrow-record.schema";
import { BorrowRecordRepository } from "./borrow-record.repository";
import { BorrowRecordService } from "./borrow-record.service";
import { BorrowRecordController } from "./borrow-record.controler";
import { BorrowRecordDashboardController } from "./borrow-record.dashboard.controller";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: BorrowRecord.name, schema: BorrowRecordSchema }])],
  controllers: [BorrowRecordController,BorrowRecordDashboardController],
  providers: [BorrowRecordService, BorrowRecordRepository],
  exports: [BorrowRecordService, BorrowRecordRepository]
})
export class BorrowRecordModule { }