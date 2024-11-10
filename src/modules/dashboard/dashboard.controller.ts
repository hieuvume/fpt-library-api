import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard/stats')
export class DashboardController {
  constructor(private readonly bookService: DashboardService) {}
  
  @Get('admin')
  async adminStats() {
    return this.bookService.getAdminDashboardStats();
  }

  @Get('librarian')
  async librarianStats() {
    return this.bookService.getLibrarianDashboardStats();
  }

}