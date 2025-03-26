import { Router } from "express";
import { filter, forgotPassword, getAllUsers, logout, me, passwordReset, signin, signup, verify_email } from "../controllers/UserController";
import { UserAuth } from "../middlewares/UserAuthentication";

export const UserRouter = Router();

UserRouter.post("/signup" , signup);
UserRouter.post("/signin" , signin);
UserRouter.post("/logout" , logout)
UserRouter.post("/filter-unverified" , filter);
UserRouter.post("/verify-mail" , verify_email);
UserRouter.get("/data" , getAllUsers);
UserRouter.get("/me" , UserAuth , me); // PROTECTED ENDPOINT!!
UserRouter.post("/send-otp-for-forgot-password" , forgotPassword);
UserRouter.post("/reset-password" , passwordReset);