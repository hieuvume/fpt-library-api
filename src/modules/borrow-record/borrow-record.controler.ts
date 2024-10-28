import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "modules/auth/guards/auth.guard";
import { BorrowRecordService } from "./borrow-record.service";


@Controller("borrow-records")
export class BorrowRecordController {
  constructor(private readonly borrowRecordService: BorrowRecordService) {}

  @UseGuards(AuthGuard)
  @Get("current-loans")
  async findCurrentLoans(
    @Req() req,
  ) {
    return this.borrowRecordService.findCurrentLoans(
      req.user.id,
    );
  }

  @UseGuards(AuthGuard)
  @Get("histories")
  async findAllBooks(
    @Req() req,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("sort") sort: string,
    @Query("order") order: string
  ) {
    return this.borrowRecordService.findHistoriesBook(
      req.user.id,
      page,
      limit,
      sort,
      order
    );
  }
}
