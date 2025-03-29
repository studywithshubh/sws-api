import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import { UserRouter } from './routes/UserRoutes';
import cookieParser from "cookie-parser";
import { CoursesRouter } from './routes/CoursesRoutes';
import { ContentRouter } from './routes/ContentRoutes';
import { PaymentRouter } from './routes/PaymentRoutes';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: 'https://swsfetest.vercel.app', // testing purposes
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use("/api/v1/auth/user", UserRouter);
app.use("/api/v1/courses", CoursesRouter);
app.use("/api/v1/content", ContentRouter);
app.use("/api/v1/sws/payment", PaymentRouter);

app.get("/", (req, res) => {
    res.send("SWS NEW SERVER IS UP!!")
})

app.listen(PORT, () => {
    console.log(`BACKEND IS HOSTED : http://localhost:${PORT}`)
});