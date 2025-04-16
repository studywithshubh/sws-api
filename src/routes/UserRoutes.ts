import { Router } from "express";
import { filter, forgotPassword, get_unverified_users, getAllUsers, getUserCourses, logout, me, passwordReset, session, signin, signup, verify_email } from "../controllers/UserController";
import { UserAuth } from "../middlewares/UserAuthentication";

export const UserRouter = Router();

UserRouter.post("/signup" , signup);
UserRouter.post("/signin" , signin);
UserRouter.post("/logout" , logout)
UserRouter.post("/filter-unverified" , filter);
UserRouter.get("/unverified" , get_unverified_users);
UserRouter.post("/verify-mail" , verify_email);
UserRouter.get("/data" , getAllUsers);
UserRouter.get("/me" , UserAuth , me); // PROTECTED ENDPOINT!!
UserRouter.get("/session" , UserAuth , session) // User Session!, Protected Endpoint!
UserRouter.post("/send-otp-for-forgot-password" , forgotPassword);
UserRouter.post("/reset-password" , passwordReset);

UserRouter.get("/my-courses" , UserAuth , getUserCourses); // PROTECTED ENDPOINT!!