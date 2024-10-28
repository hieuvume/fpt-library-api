import {
    Body,
    Controller,
    Get,
    Post,
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
    constructor(private readonly borrowRecordService: BorrowRecordService) {}

    // @UseGuards(RolesGuard)
    // @Roles(Role.LIBRARIAN)
    @Get("current-loans")
    async findCurrentLoans(
      @Query('page') page = 1, 
      @Query('limit') limit = 10 
    ) {
      return this.borrowRecordService.findAllLoans(Number(page), Number(limit));
    }
  
    
  }
  