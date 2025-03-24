import { Router } from "express";
import { UserAuth } from "../middlewares/UserAuthentication";
import { getPaymentDetails, initiatePayment, verifyPayment } from "../controllers/PaymentController";

export const PaymentRouter = Router();

PaymentRouter.post('/initiate', UserAuth, initiatePayment);

// Verify payment (webhook or frontend callback)
PaymentRouter.post('/verify/:paymentId', UserAuth, verifyPayment);

// Get payment details
PaymentRouter.get('/:paymentId', UserAuth, getPaymentDetails);