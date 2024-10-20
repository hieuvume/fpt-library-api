import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "../user/user.module"; // Import UserModule
import { ResetPasswordController } from "./reset-password.controller";
import { ResetPasswordRepository } from "./reset-password.repository";
import { ResetPassword, ResetPasswordSchema } from "./reset-password.schema";
import { ResetPasswordService } from "./reset-password.service";

@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([{ name: ResetPassword.name, schema: ResetPasswordSchema }])
    ],
    providers: [ResetPasswordService, ResetPasswordRepository],
    controllers: [ResetPasswordController],
})
export class ResetPasswordModule { }
