import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { Setting, SettingSchema } from './setting.schema';
import { SettingRepository } from './setting.repository';

@Module({
    imports: [MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }])],
    controllers: [SettingController],
    providers: [SettingService, SettingRepository],
})
export class SettingModule { }