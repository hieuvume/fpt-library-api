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
@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Get("histories")
  async histories(
    @Req() req,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("sort") sort: string,
    @Query("order") order: string
  ) {
    return this.paymentService.getPaymentsByUserId(
      req.user.id,
      page,
      limit,
      sort,
      order
    );
  }


  @Get(":id")
  async findById(@Req() req, @Param("id") id: string) {
    const payment = await this.paymentService.getPaymentById(id);
    if (!payment) {
        throw new NotFoundException("Payment not found");
    }
    if (payment.user._id != req.user.id) {
      throw new NotFoundException("Payment not found");
    }
    return payment;
  }

  @Put(":id/cancel")
  async cancelPayment(@Req() req, @Param("id") id: string) {
    const payment = await this.paymentService.getPaymentById(id);
    if (!payment) {
        throw new NotFoundException("Payment not found");
    }
    if (payment.user._id != req.user.id) {
      throw new NotFoundException("Payment not found");
    }
    return this.paymentService.failPayment(id);
  }

}
