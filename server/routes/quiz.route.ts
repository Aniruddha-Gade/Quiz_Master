import { Router } from "express";
import { createQuiz, getSingleQuiz } from "../controllers/quiz.controller";

const quizRouter = Router()

quizRouter.get('/get-quiz/:id', getSingleQuiz)
quizRouter.post('/create-quiz', createQuiz)


export default quizRouter