import { Controller, Get, Post, Body, Param, UseGuards, Req, Query, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('dashboard/users')
export class UserDashboardController {
    constructor(private readonly userService: UserService) { }

    @Get('')
    async list() {
        return this.userService.findAll(); 
    }
    @Get('list')
    async listUsers(@Query() query) {
        return this.userService.findAllUser(query);
    }

}


