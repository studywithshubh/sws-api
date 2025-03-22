import { Router } from "express";
import { filter, getAllUsers, signin, signup, test, verify_email } from "../controllers/UserController";
import { UserAuth } from "../middlewares/UserAuthentication";

export const UserRouter = Router();

UserRouter.post("/signup" , signup);
UserRouter.post("/signin" , signin);
UserRouter.post("/filter-unverified" , filter);
UserRouter.post("/verify-mail" , verify_email);
UserRouter.get("/data" , getAllUsers);
UserRouter.get("/test", UserAuth , test); // Protected Route!