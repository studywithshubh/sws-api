import express from 'express';
import { PORT } from './config';
import { UserRouter } from './routes/UserRoutes';
import cookieParser from "cookie-parser";
import { CoursesRouter } from './routes/CoursesRoutes';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth/user" , UserRouter);
app.use("/api/v1/courses" , CoursesRouter);

app.get("/" , (req , res) => {
    res.send("SWS NEW SERVER IS UP!!")
})

app.listen(PORT , () => {
    console.log(`BACKEND IS HOSTED : ${PORT}`)
});