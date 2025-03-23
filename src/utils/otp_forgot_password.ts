import { Response } from "express";
import { SWS_SENDERMAIL_VERIFICATION, SWSMAIL_PASSWORD } from "../config";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: SWS_SENDERMAIL_VERIFICATION,
        pass: SWSMAIL_PASSWORD,
    },
});

export const sendOtp_forgotPassword = async (to: string , otpGenerated:string) => {
    const inServerGeneratedOtp = otpGenerated;

    const mailOptions = {
        from: SWS_SENDERMAIL_VERIFICATION,
        to,
        subject: "Otp For Password Reset for SWS",
        text: `HERE IS YOUR OTP: ${inServerGeneratedOtp} FOR Password Reset FOR STUDYWITHSHUBH`,
    };
    
    await transporter.sendMail(mailOptions);
};

export const resetPassword = async (otpEntered:string , mail:string , newPassword:string , res:Response) => {
    const user = await prisma.user.findFirst({
        where: {
            email: mail
        }
    })

    if (!user) {
        res.status(401).json({
            message: "USER NOT FOUND!"
        })
        return;
    }
    else {
        if (user.otpForResetPassword === otpEntered) {
            const newHashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: {
                    email: mail
                },
                data: {
                    password: newHashedPassword
                }
            })

            await prisma.user.update({
                where: {
                    email: mail
                },
                data: {
                    otpForResetPassword: "PASSWORD_RESET_DONE"
                }
            })

            res.status(200).json({
                message: `${user.username}'s New Password Set Successfully!!`
            })
            return;
        }
        else {
            res.status(400).json({
                message: "INVALID OTP ENTERED!"
            })
            return;
        }
    }
}