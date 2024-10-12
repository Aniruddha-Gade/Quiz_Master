import { Response, Request, NextFunction } from 'express';
import QuizModel, { IQuiz } from "../models/quiz.model";
import { catchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from '../utils/ErrorHandler';








// =========================== GET SINGLE QUIZ ===========================
export const getSingleQuiz = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quizId } = req.params; // 4-digit quiz ID
        // validate id
        if (!quizId) {
            return next(new ErrorHandler('quiz Id is required', 400, "Error while getting quiz by id"));
        }

        // find quiz from DB by id
        const quiz = await QuizModel.findById(quizId); // Find by 4-digit ID

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





// =========================== CREATE QUIZ ===========================
export const createQuiz = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, questions, description } = req.body as IQuiz;

        // validate data
        if (!title || !questions || !description) {
            return next(new ErrorHandler('title , questions, description are required', 400, "Error while creating quiz"));
        }

        const formattedQuestions = questions.map(q => ({
            ...q,
            correctAnswer: Number(q.correctAnswer)  // Convert answer to a number
        }));

        // create quiz in DB
        const quiz = await QuizModel.create({
            title, description,
            questions: formattedQuestions,
            // id: Math.floor(1000 + Math.random() * 9000)  // Generate a unique 4-digit ID
        });


        // send quiz response
        res.status(200).json({
            success: true,
            message: 'Quiz created successfully',
            quiz
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400, "Error while creating"));
    }
})





// =========================== GET ALL QUIZES ===========================
export const getAllQuizzes = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const quizzes = await QuizModel.find({});

        // send quiz response
        res.status(200).json({
            success: true,
            message: 'All Quizzes fetched successfully',
            quizzes
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400, "Error while creating"));
    }
})




// =========================== GET ALL QUIZES ===========================
export const deleteQuiz = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quizId } = req.params;
        if (!quizId) {
            return next(new ErrorHandler('quizId is required', 400, "Error while deleting quiz"));

        }
        const quiz = await QuizModel.findByIdAndDelete(quizId);

        if (!quiz) return next(new ErrorHandler('Quiz not found', 404, "Error while deleting quiz"));

        // send quiz response
        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully',
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400, "Error while deleting quiz"));
    } 
})