import { Response, Request, NextFunction } from 'express';
import QuizModel, { IQuiz } from "../models/quiz.model";
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
        const quiz = await  QuizModel.create({
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
export const createAllQuizes = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
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
        const quiz = await  QuizModel.create({
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