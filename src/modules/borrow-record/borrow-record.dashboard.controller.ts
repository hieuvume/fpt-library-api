import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "modules/auth/guards/auth.guard";
import { BorrowRecordService } from "./borrow-record.service";
import { RolesGuard } from "modules/role/guards/roles.guard";
import { Roles } from "modules/role/decorators/roles.decorator";
import { Role } from "modules/role/enums/role.enum";



@Controller("borrow-records-dashboard")
export class BorrowRecordDashboardController {
  constructor(private readonly borrowRecordService: BorrowRecordService) { }

  // @UseGuards(RolesGuard)
  // @Roles(Role.LIBRARIAN)
  @Get("current-loans")
  async findCurrentLoans(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    return this.borrowRecordService.findAllLoans(Number(page), Number(limit));
  }
  
  @UseGuards(RolesGuard,AuthGuard)
  @Roles(Role.LIBRARIAN)
  @Put('update-status')
  async updateBorrowStatus(
    @Req() req,
    @Body('borrowId') borrowId: string,
    @Body('bookId') bookId: string,
    @Body('borrowStatus') borrowStatus: string,
    @Body('bookStatus') bookStatus: string,
    @Body('userId') userId: string
  ) {
    return this.borrowRecordService.updateStatusBook(borrowId, bookId, borrowStatus, bookStatus, userId, req.user.id);
  }
  @Get('details/:id')
  async detail(@Param('id') id: string) {
    return this.borrowRecordService.findById(id);
  }
}
