import express from 'express';
import { PORT } from './config';

const app = express();

app.use(express.json());

app.get("/" , (req , res) => {
    res.send("SWS NEW SERVER IS UP!!")
})

app.listen(PORT , () => {
    console.log(`BACKEND IS HOSTED : ${PORT}`)
});