import { Request, Response } from "express";
import { createContentValidationSchema } from "../utils/zodSchema";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createContent = async (req: Request, res: Response) => {
    try {
        // Validate the request body
        const result = createContentValidationSchema.safeParse(req.body);

        // If validation fails, return an error
        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.flatten().fieldErrors,
            });
            return
        }

        const { type, title, description, videoUrl, notesUrl, parentId } = result.data;

        // Validate videoUrl and notesUrl based on type
        if (type === 'file' && !videoUrl && !notesUrl) {
            res.status(400).json({
                message: 'At least one of videoUrl or notesUrl is required for type "file"',
            });
            return
        }
        if (type === 'folder' && (videoUrl || notesUrl)) {
            res.status(400).json({
                message: 'videoUrl and notesUrl are not allowed for type "folder"',
            });
            return
        }

        // Check if parentId exists (if provided)
        if (parentId) {
            const parentContent = await prisma.content.findUnique({
                where: { id: parentId },
            });
            if (!parentContent) {
                res.status(404).json({
                    message: 'Parent content not found',
                });
                return
            }
        }

        // Check if content with the same title already exists
        const existingContent = await prisma.content.findFirst({
            where: { title },
        });
        if (existingContent) {
            res.status(400).json({
                message: 'Content with this title already exists',
            });
            return
        }

        // Create the content
        const content = await prisma.content.create({
            data: {
                type,
                title,
                description,
                videoUrl,
                notesUrl,
                parentId,
            },
        });

        // Return the created content
        res.status(201).json({
            message: 'Content created successfully',
            data: content,
        });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Something went wrong, please try again later',
        });
        return
    }
};