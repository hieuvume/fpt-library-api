import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "modules/auth/guards/auth.guard";
import { BorrowRecordService } from "./borrow-record.service";

@UseGuards(AuthGuard)
@Controller("borrow-records")
export class BorrowRecordController {
  constructor(private readonly borrowRecordService: BorrowRecordService) {}

  @Get("current-loans")
  async findCurrentLoans(@Req() req) {
    return this.borrowRecordService.findCurrentLoans(req.user.id);
  }

  @Get("histories")
  async findAllBooks(@Req() req, @Query() query) {
    return this.borrowRecordService.findHistoriesBook(req.user.id, query);
  }

  @Put(":id/cancel")
  async cancelBorrow(@Req() req, @Param("id") id: string) {
    const payment = await this.borrowRecordService.findById(id);
    if (!payment) {
      throw new NotFoundException("Payment not found");
    }
    if (payment.user._id != req.user.id) {
      throw new NotFoundException("Payment not found");
    }
    return this.borrowRecordService.cancelBorrow(id);
  }
}
