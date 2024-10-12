import { Router } from "express";
import { createQuiz, deleteQuiz, getAllQuizzes, getSingleQuiz, updateQuestion } from "../controllers/quiz.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth";

const quizRouter = Router()


// ========================== ONLY FOR AUTHENICATED STUDENT ==========================
quizRouter.get('/get-quiz/:quizId', getSingleQuiz)
quizRouter.get('/get-all-quizzes', getAllQuizzes)




// ========================== ONLY FOR ADMIN ==========================
quizRouter.post('/create-quiz', createQuiz)
quizRouter.delete('/delete-quiz/:quizId', deleteQuiz)
quizRouter.put('/update-question/:quizId/:questionIndex',updateQuestion);


export default quizRouter