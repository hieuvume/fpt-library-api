import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Seeder } from "nestjs-seeder";
import { Setting } from "./setting.schema";

@Injectable()
export class SettingSeeder implements Seeder {
  constructor(
    @InjectModel(Setting.name) private readonly settingModel: Model<Setting>
  ) {}

  async seed(): Promise<any> {
    const newSetting = new this.settingModel({
      max_borrow_duration: 7,
      overdue_penalty_per_day: 10000,
      bank_name: "Vietcombank",
      bank_account: "0899622850",
      bank_account_name: "VU TRUNG HIEU",
      bank_code: "970436",
      momo_account_name: "VU TRUNG HIEU",
      momo_account_number: "0899622850",
      created_at: new Date(),
      updated_at: new Date(),
    });
    return newSetting.save();
  }

  async drop(): Promise<any> {
    return this.settingModel.deleteMany({});
  }
}
