import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "modules/auth/guards/auth.guard";
import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get("/profile")
  async profile(@Req() req) {
    return this.userService.profile(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Put("/profile")
  async updateProfile(@Req() req, @Body() data: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.id, data);
  }

  @UseGuards(AuthGuard)
  @Put("/profile/password")
  async updatePassword(
    @Req() req,
    @Body("current_password") current_password: string,
    @Body("password") password: string
  ) {
    return this.userService.updatePassword(
      req.user.id,
      current_password,
      password
    );
  }

  @UseGuards(AuthGuard)
  @Put("/profile/avatar")
  async updateAvatar(@Req() req, @Body("avatar_url") avatar_url: string) {
    return this.userService.updateAvatar(req.user.id, avatar_url);
  }
}
