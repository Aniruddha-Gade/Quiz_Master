import { Router } from "express";
import { getSingleQuiz } from "../controllers/quiz.controller";

const quizRouter = Router()

quizRouter.get('/get-quiz/:id', getSingleQuiz)


export default quizRouter