import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('book')
export class BookController {
  constructor(private readonly UserService: UserService) {}

  //api get by id
  //error handling if user not found
  @Get(':id')
  async getUserbyId(@Param('id') id) {
    return this.UserService.getUserbyId(id);
  }
  @Post('add')
  async addBook(@Body() book) {
    
  }

}