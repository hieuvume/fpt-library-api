import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Membership, MembershipSchema } from "./membership.schema";
import { MembershipController } from "./membership.controller";
import { MembershipService } from "./membership.service";
import { MembershipRepository } from "./membership.repository";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Membership.name, schema: MembershipSchema }]), ],
  controllers: [MembershipController],
  providers: [MembershipService, MembershipRepository],

})
export class MembershipModule { }
