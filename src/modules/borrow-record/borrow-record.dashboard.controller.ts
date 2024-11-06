import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    Query,
    Req,
    UseGuards
} from "@nestjs/common";
import { AuthGuard } from "modules/auth/guards/auth.guard";
import { Roles } from "modules/role/decorators/roles.decorator";
import { Role } from "modules/role/enums/role.enum";
import { RolesGuard } from "modules/role/guards/roles.guard";
import { BorrowRecordService } from "./borrow-record.service";

@Controller("borrow-records-dashboard")
export class BorrowRecordDashboardController {
    constructor(private readonly borrowRecordService: BorrowRecordService) { }

    // @UseGuards(RolesGuard)
    // @Roles(Role.LIBRARIAN)
    @Get("current-loans")
    async findCurrentLoans(
        @Query() query
    ) {
        return this.borrowRecordService.findAllLoans(query);
    }

    @UseGuards(RolesGuard, AuthGuard)
    @Roles(Role.LIBRARIAN)
    @Put('approve')
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
        return this.borrowRecordService.findBorrowRecordByID(id);
    }
    @Get('book-loans/:id')
    async findBook(@Param('id') id: string) {
        return this.borrowRecordService.findBookByBookTitle(id);
    }
    @Get('overview-statistics')
    async getOverviewStatistics() {
        return this.borrowRecordService.getOverviewStatistics();
    }
    @Get('status-statistics')
    async getStatusStatistics() {
        return this.borrowRecordService.getStatusStatistics();
    }
}