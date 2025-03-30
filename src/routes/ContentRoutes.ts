import { Router } from "express";
import { createContent, getContentById, getContentChildren } from "../controllers/ContentController";

export const ContentRouter = Router();

ContentRouter.post("/create", createContent);
ContentRouter.get("/:id", getContentById);
ContentRouter.get("/:id/children", getContentChildren);