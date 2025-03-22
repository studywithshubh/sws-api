import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import { FINAL_MAIL_VERIFICATION, sendOtp } from "../utils/otp_mail_verification";
import { JWT_USER_SECRET } from "../config";

const prisma = new PrismaClient();

const signupValidationSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    contactNumber: z.string().max(10),
    password: z.string().min(6),
});

const signinValidationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const signup = async (req: Request, res: Response) => {
    try {

        const result = signupValidationSchema.safeParse(req.body);

        // If validation fails, return an error
        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }

        const { username, email, contactNumber, password } = result.data;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (existingUser) {
            res.status(400).json({
                message: "User already exists in SWS Database!!"
            });
            return;
        }

        // Uptill here input validation is done!

        // HASHING THE PASSWORD:

        const hashedPassword = await bcrypt.hash(password, 10);
        const otpGenerated = Math.floor(100000 + Math.random() * 900000).toString(); // SToring OTP in DB Here FOr Further VErification
        // STORING the user to Database!
    
        const USER = await prisma.user.create({
            data: {
                username: username,
                email: email,
                contactNumber: contactNumber,
                password: hashedPassword,
                otpForVerification: otpGenerated // THE GENERATED OTP IS STORED IMMEDIATELY IN THE DATABASE!!
            }
        });

        // Otp SENT To the User for Verification
        await sendOtp(email , otpGenerated);

        res.json({
            message: `OTP Sent to ${USER.email} for verification!`,
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something Went Wrong, Please Try Again Later"
        });
    }
};

export const verify_email = async (req:Request , res:Response) => {
    const { email , otpEntered } = req.body;
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });

    if (user?.email === email) {
        FINAL_MAIL_VERIFICATION(otpEntered , email , res)
    }
    else {
        res.status(400).json({
            message: "Enter the correct email address, the email which you entered while SignUp!"
        });
        return;
    }
}

export const signin = async (req:Request , res:Response) => {
    try {
        const result = signinValidationSchema.safeParse(req.body);

        // If validation fails, return an error
        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }

        const { email,  password } = result.data;
        
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            res.status(400).json({
                message: 'User Not Found'
            });
            return;
        }

        const matchPassword = await bcrypt.compare(password , user.password);
        if (!matchPassword) {
            res.status(401).json({
                message: "Incorrect Password!"
            })
            return;
        }

        // if everything is up!, Generate a Token!!
        res.status(200).json({
            message: "Will implement COOKIE based Authentication!!!"
        })


    } catch(error) {

    } 
}

export const filter = async (req:Request , res:Response) => {
    await prisma.user.deleteMany({
        where: {
            isMailVerified: false
        }
    })

    const data = await prisma.user.findMany();

    res.status(200).json({
        message: "Deleted all the unverified users!!",
        data
    })
}


interface UserResponse {
    username: string;
    email: string;
    contactNumber: string;
    isMailVerified: boolean;
}

export const getAllUsers = async (req:Request , res:Response) => {
    const USERS = await prisma.user.findMany();
    let finalUserArray: UserResponse[] = [];
    
    USERS.forEach(user => {
        finalUserArray.push({
            username: user.username,
            email: user.email,
            contactNumber: user.contactNumber,
            isMailVerified: user.isMailVerified
        })
    })
    res.json({
        message: "All the users in the Database!",
        finalUserArray
    })
}