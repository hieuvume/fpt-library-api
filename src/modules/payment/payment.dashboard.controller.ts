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

//@UseGuards(AuthGuard)
@Controller("dashboard/payments")
export class PaymentDashboardController {
  constructor(private readonly paymentService: PaymentService) { }

  @Get("")
  async getPayments(@Query() query) {
    return this.paymentService.getPayments(query);
  }
  @Get('monthly-statistics')
  async getMonthlyPaymentStatistics() {
    return this.paymentService.getMonthlyPaymentStatistics();
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
