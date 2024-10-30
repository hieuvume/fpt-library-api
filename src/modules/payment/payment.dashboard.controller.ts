import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "modules/auth/guards/auth.guard";
import { PaymentService } from "./payment.service";

@UseGuards(AuthGuard)
@Controller("dashboard/payments")
export class PaymentDashboardController {
  constructor(private readonly paymentService: PaymentService) { }

  @Get("")
  async getPayments(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("sort") sort: string,
    @Query("order") order: string
  ) {
    return this.paymentService.getPayments(
      page,
      limit,
      sort,
      order
    );
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @Put(":id")
  async updatePayment(@Req() req, @Param("id") id: string) {
    return this.paymentService.failPayment(id);
  }

  @Put(":id/approve")
  async approvePayment(@Req() req, @Param("id") id: string) {
    return this.paymentService.approvePayment(id);
  }

  @Put(":id/reject")
  async rejectPayment(@Req() req, @Param("id") id: string) {
    return this.paymentService.rejectPayment(id);
  }

  @Put(":id/rollback")
  async rollbackPayment(@Req() req, @Param("id") id: string) {
    return this.paymentService.rollbackPayment(id);
  }

}
