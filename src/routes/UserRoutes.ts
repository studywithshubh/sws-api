import { Router } from "express";
import { filter, signup } from "../controllers/UserController";

export const UserRouter = Router();

UserRouter.post("/signup" , signup);
UserRouter.post("/filter-unverified" , filter);