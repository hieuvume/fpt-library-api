import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BorrowRecord, BorrowRecordSchema } from './borrow-record.schema';
import { BorrowRecordController } from './borrow-record.controler';
import { BorrowRecordService } from './borrow-record.service';
import { BorrowRecordRepository } from './borrow-record.repository';



@Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: BorrowRecord.name, schema: BorrowRecordSchema }])],
    controllers: [BorrowRecordController],
    providers: [BorrowRecordService, BorrowRecordRepository],
})
export class BorrowRecordMoule { }