import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import { ErrorMiddleware } from "./middleware/error";
import quizRouter from "./routes/quiz.route";

export const app = express();


// body parser
app.use(express.json({ limit: "50mb" }));
// cookie parser
app.use(cookieParser());
// cors => cors
app.use(
    cors({
        origin: [],
        credentials: true
    })
);





// Default Route
app.get('/', (req: Request, res: Response,) => {
    // console.log('Your server is up and running..!');
    res.send(`<div>
    <h1>Quz Api Backend</h1>
    <p>This is Default Route</p>
    <p>Everything is OK</p>
    </div>`);
})


// mount routes
app.use("/api/v1/auth", userRouter)
app.use("/api/v1/quiz", quizRouter)


// handle Error by using OOPS
app.use(ErrorMiddleware) 