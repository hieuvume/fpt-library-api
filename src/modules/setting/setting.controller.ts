import { Controller, Get } from '@nestjs/common';
import { SettingService } from './setting.service';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('')
  async findAll() {
    return this.settingService.initIfEmpty();
  }

}