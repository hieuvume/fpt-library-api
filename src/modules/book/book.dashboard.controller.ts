import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { AuthGuard } from 'modules/auth/guards/auth.guard';
import { RolesGuard } from 'modules/role/guards/roles.guard';
import { Roles } from 'modules/role/decorators/roles.decorator';
import { Role } from 'modules/role/enums/role.enum';

// @UseGuards(AuthGuard, RolesGuard)
@Roles(Role.LIBRARIAN)
@Controller('dashboard/books')
export class BookDashboardController {
    constructor(private readonly bookService: BookService) { }

    @Get('')
    async list() {
        
    }

    @Post('')
    async store(@Body() book) {

    }

    @Get(':id')
    async show(@Param('id') id) {
        
    }

    @Post(':id')
    async update(@Param('id') id, @Body() book) {

    }

    @Delete(':id')
    async delete(@Param('id') id) {

    }

}