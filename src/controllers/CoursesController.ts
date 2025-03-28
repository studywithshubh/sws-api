import { Request, Response } from "express";
import { createCourseValidationSchema } from "../utils/zodSchema";
import prisma from "../db/prisma";


export const createCourse = async (req:Request , res:Response) => { 
    try {
        const result = createCourseValidationSchema.safeParse(req.body);

        // If validation fails, return an error
        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }
        


        const { title , imageUrl , notionUrl , price , couponCode , discountedPrice } = result.data;

        // Check if course already exists
        const existingCourse = await prisma.course.findFirst({
            where: {
                title: title
            }
        });
        if (existingCourse) {
            res.status(400).json({
                message: "Course already exists!!"
            });
            return;
        }

        const course = await prisma.course.create({
            data: {
                title,
                imageUrl,
                notionUrl,
                price,
                couponCode,
                discountedPrice
            }
        })

        res.status(200).json({
            message: "Course Created Successfully!!",
            course
        })

    } catch(error) {
        res.status(500).json({
            message: "Something Went Wrong, Please Try Again Later"
        })
    }
}

export const getAllCourses = async (req:Request , res:Response) => {
    const COURSES = await prisma.course.findMany();
    res.status(200).json({
        COURSES
    })
}