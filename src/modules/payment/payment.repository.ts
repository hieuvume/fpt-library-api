import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { PaymentDocument } from './payment.schema';

@Injectable()
export class PaymentRepository {
  constructor(@InjectModel('Payment') private paymentModel: PaginateModel<PaymentDocument>) { }

  async findAll() {
    return this.paymentModel.find().exec();
  }

  async create(data: any) {
    return this.paymentModel.create(data);
  }

  async findById(id: string) {
    return this.paymentModel.findById(id).populate(['membership', 'user', 'from', 'to']).exec();
  }

  async findByTransactionId(transactionId: string) {
    return this.paymentModel.findOne({ transaction_id: transactionId }).exec();
  }

  async getPaymentsByUserId(
    userId: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string
  ) {
    const sort: Record<string, any> = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    return this.paymentModel.paginate(
      {
        user: new Types.ObjectId(userId),
      },
      {
        page,
        limit,
        populate: [],
        sort,
      }
    );
  }

  async getPayments(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string
  ) {
    const sort: Record<string, any> = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    return this.paymentModel.paginate(
      {},
      {
        page,
        limit,
        populate: [{ path: "membership" }],
        sort,
      }
    );
  }

  async isExistPendingPayment(userId: string) {
    return this.paymentModel.exists({
      user: new Types.ObjectId(userId),
      payment_status: "pending",
    });
  }

}