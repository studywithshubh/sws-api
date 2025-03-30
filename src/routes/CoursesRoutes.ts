import { Router } from "express";
import { addContentToCourse, createCourse, getAllCourses, getCourseById, getCourseContent } from "../controllers/CoursesController";

export const CoursesRouter = Router();

CoursesRouter.post('/create', createCourse);
CoursesRouter.get("/all", getAllCourses);
CoursesRouter.get("/:id", getCourseById);
CoursesRouter.get('/:courseId/content', getCourseContent);
CoursesRouter.post('/add-content', addContentToCourse); // New endpoint