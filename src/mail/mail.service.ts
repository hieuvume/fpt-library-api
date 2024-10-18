import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'modules/user/user.schema';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendPasswordRequest(user: User, token: string) {
        const url = `http://localhost:3000/password/reset?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            template: './forgot-password',
            context: {
                name: user.full_name,
                url: url,
            },
        });
    }
}
