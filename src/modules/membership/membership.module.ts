import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Membership, MembershipSchema } from "./membership.schema";
import { MembershipController } from "./membership.controller";
import { MembershipService } from "./membership.service";
import { MembershipRepository } from "./membership.repository";
import { MembershipDashBoardController } from "./membership-dashboard.controller";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Membership.name, schema: MembershipSchema }]), ],
  controllers: [MembershipController, MembershipDashBoardController],
  providers: [MembershipService, MembershipRepository],
  exports: [MembershipService, MembershipRepository],
})
export class MembershipModule { }
