import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";


import { MembershipCard, MembershipCardSchema } from "./membership-card.schema";
import { MembershipCardController } from "./membership-card.controller";
import { MembershipCardService } from "./membership-card.service";
import { MembershipCardRepository } from "./membership-card.repository";
import { MembershipCardDashboardController } from "./membership-card.dashboard.controller";


@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: MembershipCard.name, schema: MembershipCardSchema }]), ],
  controllers: [MembershipCardController,MembershipCardDashboardController],
  providers: [MembershipCardService, MembershipCardRepository],
  exports: [MembershipCardService, MembershipCardRepository],

})
export class MembershipCardModule { }
