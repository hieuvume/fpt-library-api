import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Payment, PaymentSchema } from "./payment.schema";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentRepository } from "./payment.repository";
import { PaymentDashboardController } from "./payment.dashboard.controller";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),],
  controllers: [PaymentController, PaymentDashboardController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService, PaymentRepository],

})
export class PaymentModule { }
