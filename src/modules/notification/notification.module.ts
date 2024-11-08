import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationController } from "./notification.controller";
import { NotificationRepository } from "./notification.repository";
import { Notification, NotificationSchema } from "./notification.schema";
import { NotificationService } from "./notification.service";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule { }
