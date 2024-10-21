import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { BorrowRecord } from './borrow-record.schema';
import { BorrowRecordService } from './borrow-record.service';
import { AuthGuard } from 'modules/auth/guards/auth.guard';



// gobal

@Controller('borrow-records')
export class BorrowRecordController {
  constructor(private readonly borrowRecordService: BorrowRecordService) {}
  //History book
  @UseGuards(AuthGuard)
  @Get('histories')
  async findAllBooks(@Req() req) {
    return this.borrowRecordService.findAll(req.user.id);
  }
}