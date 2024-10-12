import { Router } from "express";
import { createQuiz, getAllQuizzes, getSingleQuiz } from "../controllers/quiz.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth";

const quizRouter = Router()

quizRouter.get('/get-quiz/:id', getSingleQuiz)
quizRouter.post('/create-quiz', createQuiz)
quizRouter.get('/get-all-quizzes', getAllQuizzes)


export default quizRouter