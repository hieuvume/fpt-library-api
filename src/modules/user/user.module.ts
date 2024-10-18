import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRepository } from "modules/user/user.repository";
import { UserService } from "./user.service";
import { User, UserSchema } from "./user.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [],
  providers: [UserService, UserRepository],
  exports: [UserRepository]
})
export class UserModule {}
