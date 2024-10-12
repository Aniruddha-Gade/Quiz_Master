import mongoose, { Document, Model, Schema } from 'mongoose';


// Question interface
export interface IQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // Index of the correct answer in the options array
}


// Quiz interface
export interface IQuiz extends Document {
    title: string;
    description: string;
    questions: IQuestion[];
}


// Quiz Schema
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
            required: true
         }
    }]
}, { timestamps: true });




const QuizModel: Model<IQuiz> = mongoose.model("Quiz", QuizSchema)
export default QuizModel
