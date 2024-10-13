import { Router } from "express";
import { createQuiz, deleteQuestion, deleteQuiz, getAllQuizzes, getSingleQuiz, updateQuestion } from "../controllers/quiz.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth";

const quizRouter = Router()


// ========================== ONLY FOR AUTHENICATED STUDENT ==========================
quizRouter.get('/get-quiz/:quizId', getSingleQuiz)
quizRouter.get('/get-all-quizzes', getAllQuizzes)




// ========================== ONLY FOR ADMIN ==========================
quizRouter.post('/create-quiz', createQuiz)
quizRouter.delete('/delete-quiz/:quizId', deleteQuiz)
quizRouter.put('/update-question/:quizId/:questionIndex', updateQuestion);
quizRouter.delete('/delete-question/:quizId/:questionIndex', deleteQuestion);


export default quizRouter