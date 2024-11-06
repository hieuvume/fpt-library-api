import { Body, Controller, Get, Put } from '@nestjs/common';
import { SettingService } from './setting.service';
import { da } from '@faker-js/faker/.';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('')
  async findAll() {
    return this.settingService.initIfEmpty();
  }
  @Put('')
  async updateSetting(@Body() data: any) {
    return this.settingService.updateSetting(data);
  }
}