import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { MailerService } from "@nestjs-modules/mailer";

@Processor("mail-queue")
export class MailProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process("send-email")
  async handleSendMail(job: Job) {
    const { to, subject, template, context } = job.data;
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      console.log(`Email sent to ${to} with subject: "${subject}"`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
    }
  }
}