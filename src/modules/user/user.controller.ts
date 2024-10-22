import { Controller, Get, Post, Body, Param, UseGuards, Req, Query, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'modules/auth/guards/auth.guard';

import { RolesGuard } from 'modules/role/guards/roles.guard';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { Role } from 'modules/role/enums/role.enum';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService

  ) { }
  @UseGuards(AuthGuard)
  @Get('/profile')
  async profile(@Req() req) {
    return this.userService.profile(req.user.id);
  }
  @UseGuards(AuthGuard)
  @Put('/profile')
  async updateProfile(@Req() req, @Body() data:any) {
    return this.userService.updateProfile(req.user.id, data);
  }

}


