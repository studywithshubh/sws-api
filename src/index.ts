import express from 'express';
import { PORT } from './config';
import { UserRouter } from './routes/UserRoutes';

const app = express();

app.use(express.json());

app.use("/api/v1/auth/user" , UserRouter);

app.get("/" , (req , res) => {
    res.send("SWS NEW SERVER IS UP!!")
})

app.listen(PORT , () => {
    console.log(`BACKEND IS HOSTED : ${PORT}`)
});