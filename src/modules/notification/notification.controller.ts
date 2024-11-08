import {
  Controller,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "modules/auth/guards/auth.guard";
import { NotificationService } from "./notification.service";

@UseGuards(AuthGuard)
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }


}
