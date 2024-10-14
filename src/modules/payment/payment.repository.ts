import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';

@Injectable()
export class PaymentRepository {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async create(data: any): Promise<Payment> {
    const newPayment = new this.paymentModel(data);
    return newPayment.save();
  }

  async findById(id: string): Promise<Payment> {
    return this.paymentModel.findById(id).exec();
  }
}