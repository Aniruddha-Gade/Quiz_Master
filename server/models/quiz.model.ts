import mongoose, { Document, Model, Schema, ObjectId } from 'mongoose';


// Question interface
export interface IQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // Index of the correct answer in the options array
}

// user data interface
export interface ITakenBy {
    userId: Schema.Types.ObjectId;
    score: number;
}

// =================== Quiz interface ===================
export interface IQuiz extends Document {
    title: string;
    description: string;
    questions: IQuestion[];
    takenBy: ITakenBy[];
}


// =================== Quiz Schema ===================
const QuizSchema: Schema<IQuiz> = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswer: {
            type: Number,
            select: false, // by default, answer will not fetched, when fetching quiz data
            required: true
        }
    }],
    // list of all students who has given quiz
    takenBy: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to User model (student ID)
            select: false, // Not selected by default
            required: true
        },
        score: {
            type: Number, // Student's score for the quiz
            select: false, // Not selected by default
            required: true
        }
    }]

}, { timestamps: true });




const QuizModel: Model<IQuiz> = mongoose.model("Quiz", QuizSchema)
export default QuizModel
