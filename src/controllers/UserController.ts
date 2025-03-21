import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const signupValidationSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    contactNumber: z.string().max(10),
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

        // STORING the user to Database!
    
        const USER = await prisma.user.create({
            data: {
                username: username,
                email: email,
                contactNumber: contactNumber,
                password: hashedPassword
            }
        });

        res.json({
            message: `${USER.username} SignedUp successfully To SWS`
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

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