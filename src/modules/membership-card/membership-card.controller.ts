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
import { UpgradePlanDto } from "./dto/upgrade-plan.dto";
import { ExtendPlanDto } from "./dto/extend-plan.dto";

@UseGuards(AuthGuard)
@Controller("membership-card")
export class MembershipCardController {
  constructor(private readonly membershipCardService: MembershipCardService) { }

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

  @Post("upgrade")
  async upgradeMembership(
    @Req() req,
    @Body() data: UpgradePlanDto
  ) {
    return this.membershipCardService.upgradeMembership(
      req.user.id,
      data
    );
  }

  @Post("extend")
  async extendMembership(
    @Req() req,
    @Body() data: ExtendPlanDto
  ) {
    return this.membershipCardService.extendMembership(
      req.user.id,
      data
    );
  }

}
