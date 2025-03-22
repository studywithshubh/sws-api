import nodemailer from "nodemailer";
import { SWS_SENDERMAIL_VERIFICATION, SWSMAIL_PASSWORD } from "../config";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: SWS_SENDERMAIL_VERIFICATION,
        pass: SWSMAIL_PASSWORD,
    },
});


export const sendOtp = async (to: string , otpGenerated:string) => {
    const inServerGeneratedOtp = otpGenerated;

    const mailOptions = {
        from: SWS_SENDERMAIL_VERIFICATION,
        to,
        subject: "SWS Email Verification",
        text: `HERE IS YOUR OTP: ${inServerGeneratedOtp} FOR VERIFICATION FOR STUDYWITHSHUBH`,
    };
    
    await transporter.sendMail(mailOptions);
};

export const FINAL_MAIL_VERIFICATION = async (otpEntered:string , mail:string , res:Response) => {
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
        if (user.otpForVerification === otpEntered) {
            await prisma.user.update({
                where: {
                    email: mail
                },
                data: {
                    isMailVerified: true
                }
            })

            await prisma.user.update({
                where: {
                    email: mail
                },
                data: {
                    otpForVerification: "VERIFICATION_DONE"
                }
            })
            res.status(200).json({
                message: `${user.username}'s EMAIL VERIFIED SUCCESFULLY!!`
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