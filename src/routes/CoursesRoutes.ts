import { Router } from "express";
import { createCourse, getAllCourses } from "../controllers/CoursesController";

export const CoursesRouter = Router();

CoursesRouter.post('/create' , createCourse);
CoursesRouter.get("/all" , getAllCourses);