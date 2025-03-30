import { Request, Response } from "express";
import { createCourseValidationSchema } from "../utils/zodSchema";
import prisma from "../db/prisma";


export const createCourse = async (req: Request, res: Response) => {
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



        const { title, imageUrl, notionUrl, price, couponCode, discountedPrice } = result.data;

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

    } catch (error) {
        res.status(500).json({
            message: "Something Went Wrong, Please Try Again Later"
        })
    }
}

export const getAllCourses = async (req: Request, res: Response) => {
    const COURSES = await prisma.course.findMany();
    res.status(200).json({
        COURSES
    })
}

export const getCourseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const COURSE = await prisma.course.findUnique({
        where: {
            id: parseInt(id)
        }
    })
    res.status(200).json({
        COURSE
    })
}

export const getCourseContent = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;

        // Get all content items associated with this course
        const courseContents = await prisma.courseContent.findMany({
            where: { courseId: parseInt(courseId) },
            include: {
                content: {
                    include: {
                        children: true
                    }
                }
            }
        });

        // Filter root content items (no parent)
        const rootContents = courseContents
            .filter(cc => cc.content.parentId === null)
            .map(cc => ({
                ...cc.content,
                children: cc.content.children
            }));

        res.status(200).json({ content: rootContents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch course content' });
    }
};


export const addContentToCourse = async (req: Request, res: Response) => {
    try {
        const { courseId, contentId } = req.body;

        // Check if course exists
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) }
        });
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return
        }

        // Check if content exists
        const content = await prisma.content.findUnique({
            where: { id: parseInt(contentId) }
        });
        if (!content) {
            res.status(404).json({ error: 'Content not found' });
            return
        }

        // Check if association already exists
        const existingAssociation = await prisma.courseContent.findFirst({
            where: {
                courseId: parseInt(courseId),
                contentId: parseInt(contentId)
            }
        });
        if (existingAssociation) {
            res.status(400).json({ error: 'Content already associated with course' });
            return
        }

        // Create the association
        await prisma.courseContent.create({
            data: {
                courseId: parseInt(courseId),
                contentId: parseInt(contentId)
            }
        });

        res.status(201).json({
            message: 'Content successfully added to course'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add content to course' });
    }
};