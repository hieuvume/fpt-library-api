import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MailService } from "mail/mail.service";
import { BorrowRecordRepository } from "modules/borrow-record/borrow-record.repository";
import { NotificationRepository } from "./notification.repository";

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly borrowRecordRepository: BorrowRecordRepository,
    private readonly mailService: MailService
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async sendNotificationToNearDueDate() {
    await this.processSendNotificationToNearDueDate();
  }

  async processSendNotificationToNearDueDate() {
    try {
      const nearDueIn48Hours = await this.borrowRecordRepository.findNearlyDueRecords(48, 1);
      const nearDueIn24Hours = await this.borrowRecordRepository.findNearlyDueRecords(24, 2);

      for (const record of nearDueIn48Hours) {
        const user = record.user;
        if (record.notification_count < 1) { 
          await this.mailService.sendDueDateReminder(user, record, 48);
          record.notification_count = 1;
          await record.save(); 
        }
      }

      for (const record of nearDueIn24Hours) {
        const user = record.user;
        if (record.notification_count < 2) {
          await this.mailService.sendDueDateReminder(user, record, 24);
          record.notification_count = 2;
          await record.save(); 
        }
      }

      if (nearDueIn48Hours.length > 0) {
        this.logger.log(`Đã gửi ${nearDueIn48Hours.length} email nhắc nhở sắp hết hạn trong 48h`);
      }
      if (nearDueIn24Hours.length > 0) {
        this.logger.log(`Đã gửi ${nearDueIn24Hours.length} email nhắc nhở sắp hết hạn trong 24h`);
      }
    } catch (error) {
      this.logger.error("Lỗi khi gửi nhắc nhở sắp hết hạn:", error);
    }
  }
}
