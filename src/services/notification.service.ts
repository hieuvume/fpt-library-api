import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from 'schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async create(data: any): Promise<Notification> {
    const newNotification = new this.notificationModel(data);
    return newNotification.save();
  }

  async findById(id: string): Promise<Notification> {
    return this.notificationModel.findById(id).exec();
  }
}