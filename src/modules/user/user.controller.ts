import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'modules/auth/guards/auth.guard';

import { RolesGuard } from 'modules/role/guards/roles.guard';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { Role } from 'modules/role/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService
    
  ) {}
  @UseGuards(AuthGuard)
@Get('/profile')
 async profile (@Req() req) {
  // get to middleware
     return this.userService.profile(req.user.id);
  }

 }


