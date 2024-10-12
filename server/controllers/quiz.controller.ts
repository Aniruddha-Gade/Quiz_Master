import { Response, Request, NextFunction } from 'express';
import QuizModel from "../models/quiz.model";
import { catchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from '../utils/ErrorHandler';








// =========================== GET SINGLE QUIZ ===========================
export const getSingleQuiz = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params; // 4-digit quiz ID
        // validate id
        if (!id) {
            return next(new ErrorHandler('Quiz id is required', 400, "Error while getting quiz by id"));
        }

        // find quiz from DB by id
        const quiz = await QuizModel.findById(id); // Find by 4-digit ID

        if (!quiz) return next(new ErrorHandler('Quiz not found', 404, "Error while getting quiz by id"));

        // send quiz response
        res.status(200).json({
            success: true,
            message: 'Quiz found',
            quiz
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400, "Error while getting quiz by id"));
    }
})