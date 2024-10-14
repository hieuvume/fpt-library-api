import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './setting.schema';

@Injectable()
export class SettingRepository {
  constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) {}

  async findAll(): Promise<Setting[]> {
    return this.settingModel.find().exec();
  }

  async create(data: any): Promise<Setting> {
    const newSetting = new this.settingModel(data);
    return newSetting.save();
  }

  async findById(id: string): Promise<Setting> {
    return this.settingModel.findById(id).exec();
  }

  async initIfEmpty(): Promise<Setting> {
    const settings = await this.settingModel.find().exec();
    if (settings.length === 0) {
      const newSetting = new this.settingModel({
        max_borrow_duration: 7,
        overdue_penalty_per_day: 10000,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return newSetting.save();
    }
    return settings[0];
  }

}