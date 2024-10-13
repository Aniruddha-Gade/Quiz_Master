import { Response, Request, NextFunction } from 'express';
import QuizModel, { IQuiz } from "../models/quiz.model";
import { catchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from '../utils/ErrorHandler';
import UserModel from '../models/user.model';








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




// =========================== DELETE QUIZE ===========================
export const deleteQuiz = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quizId } = req.params;
        if (!quizId) {
            return next(new ErrorHandler('quizId is required', 400, "Error while deleting quiz"));
        }

        // find by id and delete
        const quiz = await QuizModel.findByIdAndDelete(quizId);

        if (!quiz) return next(new ErrorHandler('Quiz not found', 404, "Error while deleting quiz"));

        // send delete response
        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully',
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400, "Error while deleting quiz"));
    }
})



// =========================== DELETE QUIZE ===========================
export const updateQuestion = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quizId, questionIndex } = req.params;
        const { question, options, correctAnswer } = req.body as any;

        // validate data
        if (!quizId || !questionIndex) {
            return next(new ErrorHandler('quizId, questionIndex  is required', 400, "Error while deleting quiz"));
        }

        // find quiz in DB
        const quiz = await QuizModel.findById(quizId).select('+questions.correctAnswer');
        // console.log("quiz = ",quiz)
        if (!quiz) {
            return next(new ErrorHandler('Quiz not found', 404, "Error while updating quiz question"));
        }

        if (Number(questionIndex) >= quiz.questions?.length) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // update question
        const questionToUpdate = quiz.questions[Number(questionIndex)];
        questionToUpdate.question = question || questionToUpdate.question;
        questionToUpdate.options = options || questionToUpdate.options;
        questionToUpdate.correctAnswer = correctAnswer || questionToUpdate.correctAnswer;

        await quiz.save();

        // send response
        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            quiz
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400, "Error while updating quiz question"));
    }
})



// =========================== DELETE QUIZE QUESTION ===========================
export const deleteQuestion = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quizId, questionIndex } = req.params;

        // validate data
        if (!quizId || !questionIndex) {
            return next(new ErrorHandler('quizId, questionIndex are required', 400, "Error while deleting quiz question"));
        }

        // find quiz from DB
        const quiz = await QuizModel.findById(quizId);
        if (!quiz) {
            return next(new ErrorHandler('Quiz not found', 404, "Error while deleting quiz question"));
        }

        // check Is question present or not
        if (Number(questionIndex) >= quiz.questions.length) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        // delete question by index
        quiz.questions.splice(Number(questionIndex), 1);
        await quiz.save();


        // send response
        res.status(200).json({
            success: true,
            message: 'Question deleted successfully',
            quiz
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400, "Error while deleting quiz question"));
    }
})




// =========================== SUBMIT QUIZE ===========================
export const submitQuiz = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, quizId, resultArray } = req.body;

        // validate data
        if (!quizId || !userId || !resultArray) {
            return next(new ErrorHandler('userId, quizId, resultArray are required', 400, "Error while submitting quiz"));
        }

        // find user from DB
        const user = await UserModel.findById(userId)
        if (!user) {
            return next(new ErrorHandler('User not found', 404, "Error while submitting quiz"));
        }

        // find quiz from DB by id
        const quiz = await QuizModel.findById(quizId).select("+questions.correctAnswer"); // Find by 4-digit ID
        if (!quiz) {
            return next(new ErrorHandler('Quiz not found', 404, "Error while submitting quiz"));
        }

        // console.log("resultArray = ", resultArray)

        // iterate through each answer and check answer id correct or not
        let score = 0;

        resultArray.forEach((answer: number, index: number) => {
            // console.log(`quiz?.questions[${index}]?.correctAnswer = ${quiz?.questions[index]?.correctAnswer}`)
            if (answer === quiz?.questions[index]?.correctAnswer) {
                score++;
            }
        });
        // console.log('score = ', score)

        // Add the quiz results to the user's quizzesTaken array
        user.quizzesTaken.push({
            quizId,
            score,
            resultArray // actual result of student
        });

        await user.save()

        // update quiz with current user score and userId
        quiz.takenBy.push({ userId, score });
        await quiz.save()

        // send response
        res.status(200).json({
            success: true,
            message: `User ${user.username}, (email: ${user.email}), scored: ${score} on the quiz titled - ${quiz.title}.`,
            score
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400, "Error while submitting quiz"));
    }
})