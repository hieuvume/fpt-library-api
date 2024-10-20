import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import * as crypto from 'crypto';
import { MailService } from 'mail/mail.service';
import { UserRepository } from 'modules/user/user.repository';
import { badMessage } from 'utils/helpers';
import { ResetPasswordRepository } from './reset-password.repository';

@Injectable()
export class ResetPasswordService {
  constructor(
    private userRepository: UserRepository,
    private resetPasswordRepository: ResetPasswordRepository,
    private mailService: MailService,
  ) { }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      return badMessage("email", "Email is not found in the system");
    }

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentRequest = await this.resetPasswordRepository.findOne({
      where: {
        user_id: user._id,
        created_at: { $gte: oneMinuteAgo },
      },
    });


    if (recentRequest) {
      return badMessage("email", "You can only request a password reset once every minute.");
    }


    const token = crypto.randomBytes(32).toString('hex');

    await this.resetPasswordRepository.create({
      user_id: user._id,
      token,
      created_at: new Date(),
      expiresAt: new Date(Date.now() + 3600 * 1000),
    })

    this.mailService.sendPasswordRequest(user, token)

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetPasswordRecord = await this.resetPasswordRepository.findOneByToken(token);
    if (!resetPasswordRecord || resetPasswordRecord.expiresAt < new Date()) {
      throw new BadRequestException({
        message: 'Invalid or expired token',
      });
    }

    const user = await this.userRepository.findById(resetPasswordRecord.user_id.toString());
    if (!user) {
      throw new BadRequestException({
        message: 'Invalid token'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(user._id, hashedPassword);
    await this.resetPasswordRepository.deleteByToken(token);

    return { message: 'Password reset successfully' };
  }

}