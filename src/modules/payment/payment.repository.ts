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
    query: Record<string, any>
  ) {
    const { page, limit, sort, order, ...rest } = query;
    const sortRecord: Record<string, any> = {};
    sortRecord[sort] = order === "asc" ? 1 : -1;

    const searchConditions: Record<string, any> = {};

    if (rest.search) {
      searchConditions.$or = [
        { transaction_id: { $regex: rest.search, $options: "i" } },
        { payment_status: { $regex: rest.search, $options: "i" } },
        { payment_type: { $regex: rest.search, $options: "i" } },
      ];
    }

    if (rest.pending) {
      searchConditions.payment_status = 'pending';
    }

    return this.paymentModel.paginate(
      searchConditions,
      {
        page,
        limit,
        populate: [
          { path: "membership" },
          { path: 'user' },
          { path: 'from', populate: { path: 'membership' } },
          { path: 'to', populate: { path: 'membership' } }
        ],
        sort: sortRecord,
      }
    );
  }

  async isExistPendingPayment(userId: string) {
    return this.paymentModel.exists({
      user: new Types.ObjectId(userId),
      payment_status: "pending",
    });
  }
  async getMonthlyPaymentStatistics() {
    const monthlyPayments = await this.paymentModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$payment_date' },  
            year: { $year: '$payment_date' }     
          },
          totalAmount: { $sum: '$amount' }     
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          totalAmount: 1
        }
      }
    ]);

    return monthlyPayments;
  }
}