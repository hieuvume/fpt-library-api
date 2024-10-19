import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "./guards/auth.guard";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { GoogleOauthGuard } from "./guards/google-oauth.guard";
import { Roles } from "modules/role/decorators/roles.decorator";
import { Role } from "modules/role/enums/role.enum";
import { RolesGuard } from "modules/role/guards/roles.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  async signIn(@Body() data: SignInDto) {
    const { email, password } = data;
    return this.authService.signIn(email, password);
  }

  @Get("google/login")
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res) {
    try {
      const FRONTEND_URL = 'http://localhost:3000';
      const token = await this.authService.signInViaGoogle(req.user);
      res.redirect(`${FRONTEND_URL}/auth/google?token=${token.access_token}`);
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }

  @Post("sign-up")
  async signUp(@Body() data: SignUpDto) {
    const { email, password, full_name, phone_number } = data;
    return this.authService.signUp(email, password, full_name, phone_number);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get("me")
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user.id);
  }

}
