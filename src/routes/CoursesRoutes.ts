import { Router } from "express";
import { createCourse } from "../controllers/CoursesController";

export const CoursesRouter = Router();

CoursesRouter.post('/create' , createCourse);