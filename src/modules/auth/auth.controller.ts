import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  async signIn(@Body() data: SignInDto) {
    const { email, password } = data;
    return this.authService.signIn(email, password);
  }

  @Get("sign-in/google")
  @UseGuards(NestAuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("sign-in/google/callback")
  @UseGuards(NestAuthGuard("google"))
  async googleAuthRedirect(@Req() req) {
    return this.authService.signInViaGoogle(req.user);
  }

  @Post("sign-up")
  async signUp(@Body() data: SignUpDto) {
    const { email, password, full_name, phone_number } = data;
    return this.authService.signUp(email, password, full_name, phone_number);
  }

  @UseGuards(AuthGuard)
  @Get("me")
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user.id);
  }
}
