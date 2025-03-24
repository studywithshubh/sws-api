import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { razorpay } from '../utils/razorpay';
import * as crypto from 'crypto';
import { initiatePaymentSchema, verifyPaymentSchema } from '../utils/zodSchema';

const prisma = new PrismaClient();


export const initiatePayment = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const result = initiatePaymentSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.flatten().fieldErrors
            });
            return
        }

        const { courseId, userId, couponCode } = result.data;

        // Get the course details
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return
        }

        // Check if user already purchased this course
        const existingPurchase = await prisma.userPurchases.findFirst({
            where: {
                userId,
                courseId
            }
        });

        if (existingPurchase) {
            res.status(400).json({ message: 'You already purchased this course' });
            return
        }

        // Calculate final amount (apply coupon if valid)
        let FINAL_AMOUNT_TO_PAY = course.price;
        if (couponCode && course.couponCode === couponCode && course.discountedPrice) {
            FINAL_AMOUNT_TO_PAY = course.discountedPrice;
        }

        // Create Razorpay order
        // Let's say your amount from the database is ₹800 (rupees).
        // If you send it to Razorpay without multiplying, it will be treated as ₹8.00 instead of ₹800.
        const options = {
            amount: FINAL_AMOUNT_TO_PAY * 100, // Razorpay expects amount in paise, thats why here we are multiplying by 100
            currency: 'INR',
            receipt: `receipt_${courseId}_${userId}_SWS`,
            payment_capture: 1 // Auto-capture payment
        };

        const order = await razorpay.orders.create(options);

        // Create payment record in database
        const payment = await prisma.payment.create({
            data: {
                userId,
                courseId,
                amount: FINAL_AMOUNT_TO_PAY,
                status: 'pending'
            }
        });

        res.status(200).json({
            message: 'Payment initiated',
            order,
            paymentId: payment.id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const result = verifyPaymentSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.flatten().fieldErrors
            });
            return
        }

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = result.data;
        const paymentId = req.params.paymentId;

        // Verify payment with Razorpay
        const generatedSignature = crypto

            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            res.status(400).json({ message: 'Payment verification failed' });
            return
        }

        // Update payment record
        const payment = await prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: 'completed',
                razorpayPaymentId: razorpay_payment_id,
                updatedAt: new Date()
            },
            include: {
                user: true,
                course: true
            }
        });

        // Create user purchase record
        await prisma.userPurchases.create({
            data: {
                userId: payment.userId,
                courseId: payment.courseId,
                paymentId: payment.id,
                paymentStatus: 'completed',
                amountPaid: payment.amount
            }
        });

        res.status(200).json({
            message: 'Payment verified and course assigned successfully',
            payment
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const getPaymentDetails = async (req: Request, res: Response) => {
    try {
        const paymentId = req.params.paymentId;
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                course: true,
                user: true
            }
        });

        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const handleWebhook =  () => {
    // Later!!
};