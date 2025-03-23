import { Router } from "express";
import { filter, forgotPassword, getAllUsers, me, passwordReset, signin, signup, verify_email } from "../controllers/UserController";
import { UserAuth } from "../middlewares/UserAuthentication";
import { resetPassword } from "../utils/otp_forgot_password";

export const UserRouter = Router();

UserRouter.post("/signup" , signup);
UserRouter.post("/signin" , signin);
UserRouter.post("/filter-unverified" , filter);
UserRouter.post("/verify-mail" , verify_email);
UserRouter.get("/data" , getAllUsers);
UserRouter.get("/me" , UserAuth , me); // PROTECTED ENDPOINT!!
UserRouter.post("/send-otp-for-forgot-password" , forgotPassword);
UserRouter.post("/reset-password" , passwordReset);