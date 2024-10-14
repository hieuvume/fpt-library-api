import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('home')
export class HomeController {
  // constructor(private readonly userService: UserService) {}

  @Get('')
  async findAll() {
    return 'Hello World!'
  }


}