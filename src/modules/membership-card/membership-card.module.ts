import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";


import { MembershipCard, MembershipCardSchema } from "./membership-card.schema";
import { MembershipCardController } from "./membership-card.controller";
import { MembershipCardService } from "./membership-card.service";
import { MembershipCardRepository } from "./membership-card.repository";


@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: MembershipCard.name, schema: MembershipCardSchema }]), ],
  controllers: [MembershipCardController],
  providers: [MembershipCardService, MembershipCardRepository],
  exports: [MembershipCardService, MembershipCardRepository],

})
export class MembershipCardModule { }
