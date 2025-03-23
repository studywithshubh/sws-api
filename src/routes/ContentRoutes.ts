import { Router } from "express";
import { createContent } from "../controllers/ContentController";

export const ContentRouter = Router();

ContentRouter.post("/create" , createContent);