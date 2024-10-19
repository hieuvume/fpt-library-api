import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module"; // Import UserModule
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { MailService } from "mail/mail.service";
import { GoogleStrategy } from "./strategies/auth.strategies";
import { RoleModule } from "modules/role/role.module";

@Module({
  imports: [
    RoleModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "900s" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
