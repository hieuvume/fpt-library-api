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

@Controller("membership-card")
export class MembershipCardController {
  constructor(private readonly membershipCardService: MembershipCardService) {}

  @UseGuards(AuthGuard)
  @Post("downgrade")
  async downgradeMembership(
    @Req() req,
    @Body("membershipId") membershipId: string
  ) {
    return this.membershipCardService.downgradeMembership(
      req.user.id,
      membershipId
    );
  }
}
