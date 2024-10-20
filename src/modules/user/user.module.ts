import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRepository } from "modules/user/user.repository";
import { UserService } from "./user.service";
import { User, UserSchema } from "./user.schema";
import { RoleModule } from "modules/role/role.module";
import { UserController } from "./user.controller";
import { BookModule } from "modules/book/book.module";


@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), RoleModule,BookModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository]
})
export class UserModule { }
