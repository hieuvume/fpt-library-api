import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SettingService } from 'services';
import { UserService } from 'services/user.service';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('')
  async findAll() {
    return this.settingService.initIfEmpty();
  }

}