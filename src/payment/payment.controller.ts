import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { VerifyPaymentDto } from './dto/payment.verify.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('verify')
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentService.verifyPayment(verifyPaymentDto);
  }

  @Post('webhook')
  webhook(
    @Req() req: Request & { rawBody: Buffer },
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentService.handleWebhook(req.rawBody, signature);
  }
}

// {
//     "success": true,
//     "message": "Subscription created successfully.",
//     "data": {
//         "subscriptionId": "6ea78013-b2cf-4757-827b-da6d7e37aee7",
//         "orderId": "order_TG7iChywUusbVA",
//         "amount": 89,
//         "currency": "INR",
//         "key": "rzp_test_RIcvaGeQNxmtd6"
//     }
// }
