import express, { Request, Response } from "express";
import cors from "cors";


export const app = express();


// body parser
app.use(express.json({ limit: "50mb" }));
// cookie parser

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