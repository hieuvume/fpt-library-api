import { Injectable } from '@nestjs/common';
import { SettingRepository } from './setting.repository';

@Injectable()
export class SettingService {
  constructor(private readonly settingRepository: SettingRepository) {}

  initIfEmpty() {
    return this.settingRepository.initIfEmpty();
  }

}