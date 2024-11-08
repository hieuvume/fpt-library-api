import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { BorrowRecord } from "modules/borrow-record/borrow-record.schema";
import { User } from "modules/user/user.schema";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordRequest(user: User, token: string) {
    const url = `http://localhost:3000/password/reset?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      template: "./forgot-password",
      context: {
        name: user.full_name,
        url: url,
      },
    });
  }

  async sendDueDateReminder(user: User, record: BorrowRecord, hoursLeft: number) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Reminder: Your book is due in ${hoursLeft} hours`,
      template: "./due-date-reminder", // Tên template của email nhắc nhở
      context: {
        name: user.full_name,
        title: record.book_title.title,
        dueDate: record.due_date.toLocaleDateString(),
        hoursLeft,
      },
    });
  }

  async sendOrderConfirmation(user: User, transactionId: string, amount: number, details: string, paymentType: string, membershipName: string, months: number) {
    await this.mailerService.sendMail({
        to: user.email,
        subject: 'Order Confirmation',
        template: './order-confirmation',
        context: {
            name: user.full_name,
            transactionId: transactionId,
            amount: amount,
            details: details,
            paymentType: paymentType,
            membershipName: membershipName,
            months: months,
        },
    });
}

async sendPaymentSuccessNotification(user: User, transactionId: string, amount: number, paymentDate: Date) {
    await this.mailerService.sendMail({
        to: user.email,
        subject: 'Payment Successful',
        template: './payment-success',
        context: {
            name: user.full_name,
            transactionId: transactionId,
            amount: amount,
            paymentDate: paymentDate.toDateString(),
        },
    });
}


}
