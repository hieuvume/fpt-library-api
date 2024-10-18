import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResetPassword, ResetPasswordDocument } from './reset-password.schema';

@Injectable()
export class ResetPasswordRepository {
  constructor(@InjectModel(ResetPassword.name) private ResetPasswordModel: Model<ResetPasswordDocument>) { }

  async create(data: any): Promise<ResetPassword> {
    const newResetPassword = new this.ResetPasswordModel(data);
    return newResetPassword.save();
  }

  async findOne(data: any): Promise<ResetPassword> {
    return this.ResetPasswordModel.findOne(data);
  }

  async findOneByToken(token: string): Promise<ResetPassword> {
    return this.ResetPasswordModel.findOne({ token });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.ResetPasswordModel.deleteOne({ token });
  }
  

}