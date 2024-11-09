import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "modules/auth/guards/auth.guard";
import { Roles } from "modules/role/decorators/roles.decorator";
import { Role } from "modules/role/enums/role.enum";
import { RolesGuard } from "modules/role/guards/roles.guard";
import { BorrowRecordService } from "./borrow-record.service";

@Controller("borrow-records-dashboard")
export class BorrowRecordDashboardController {
  constructor(private readonly borrowRecordService: BorrowRecordService) {}

  // @UseGuards(RolesGuard)
  // @Roles(Role.LIBRARIAN)
  @Get("current-loans")
  async findCurrentLoans(@Query() query) {
    return this.borrowRecordService.findAllLoans(query);
  }

  @UseGuards(RolesGuard, AuthGuard)
  @Roles(Role.LIBRARIAN)
  @Put("approve/:id")
  async approve(
    @Req() req,
    @Param("id") borrowId: string,
    @Body("bookId") bookId: string,
    @Body("userId") userId: string,
    @Body("before_status") beforeStatus: string
  ) {
    return this.borrowRecordService.updateStatusBook(
      borrowId,
      bookId,
      beforeStatus,
      userId,
      req.user.id
    );
  }

  @UseGuards(RolesGuard, AuthGuard)
  @Roles(Role.LIBRARIAN)
  @Put("reject/:id")
  async reject(
    @Req() req,
    @Param("id") borrowId: string,
    @Body("note") note: string
  ) {
    return this.borrowRecordService.rejectBorrow(
      borrowId,
      note,
      req.user.id
    );
  }

  @UseGuards(RolesGuard, AuthGuard)
  @Roles(Role.LIBRARIAN)
  @Put("returned/:id")
  async returned(
    @Req() req,
    @Param("id") borrowId: string,
    @Body("after_status") afterStatus: string
  ) {
    return this.borrowRecordService.returnedBorrow(borrowId, afterStatus);
  }

  @UseGuards(RolesGuard, AuthGuard)
  @Roles(Role.LIBRARIAN)
  @Put("losted/:id")
  async losted(
    @Req() req,
    @Param("id") borrowId: string,
    @Body("penalty_total") penaltyTotal: number
  ) {
    if (penaltyTotal < 0 || isNaN(penaltyTotal)) {
      throw new BadRequestException(
        "Penatly total must be a number and greater than 0"
      );
    }
    return this.borrowRecordService.lostedBorrow(borrowId, penaltyTotal);
  }

  @Get("details/:id")
  async detail(@Param("id") id: string) {
    return this.borrowRecordService.findBorrowRecordByID(id);
  }
  @Get("book-loans/:id")
  async findBook(@Param("id") id: string) {
    return this.borrowRecordService.findBookByBookTitle(id);
  }
  @Get("overview-statistics")
  async getOverviewStatistics() {
    return this.borrowRecordService.getOverviewStatistics();
  }
  @Get("status-statistics")
  async getStatusStatistics() {
    return this.borrowRecordService.getStatusStatistics();
  }
}
