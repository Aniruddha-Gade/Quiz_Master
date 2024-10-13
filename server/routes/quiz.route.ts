import { Router } from "express";
import { createQuiz, deleteQuestion, deleteQuiz, getAllQuizzes, getSingleQuiz, submitQuiz, updateQuestion } from "../controllers/quiz.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth";

const quizRouter = Router()


// ========================== ONLY FOR AUTHENICATED STUDENT ==========================
quizRouter.get('/get-quiz/:quizId',isAuthenticated, getSingleQuiz)
quizRouter.post('/submit-quiz', submitQuiz)




// ========================== ONLY FOR ADMIN ==========================
quizRouter.post('/create-quiz', createQuiz)
quizRouter.delete('/delete-quiz/:quizId', deleteQuiz)
quizRouter.put('/update-question/:quizId/:questionIndex', updateQuestion);
quizRouter.delete('/delete-question/:quizId/:questionIndex', deleteQuestion);
quizRouter.get('/get-all-quizzes', getAllQuizzes)


export default quizRouter