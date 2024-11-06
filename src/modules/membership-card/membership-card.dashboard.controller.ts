import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Req,
  } from "@nestjs/common";
  import { MembershipCardService } from "./membership-card.service";
import { AuthGuard } from "modules/auth/guards/auth.guard";
  
  @UseGuards(AuthGuard)
  @Controller("membership-card-dashboard")
  export class MembershipCardDashboardController {
    constructor(private readonly membershipCardService: MembershipCardService) { }
  
    @Get('statistics')
    async getMembershipStatistics() {
      return this.membershipCardService.getMembershipStatistics();
    }
  
  }
  