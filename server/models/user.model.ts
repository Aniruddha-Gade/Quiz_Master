import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'



interface IQuizResult {
    quizId: mongoose.Types.ObjectId; // Reference to the quiz
    score: number;                   // The user's score for that quiz
}

// user interface
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    quizzesTaken: IQuizResult[];      // Array of quiz results
    comparePassword: (password: string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}


// user schema
const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Array to store multiple quiz results
    quizzesTaken: [
        {
            quizId: { type: mongoose.Schema.Types.ObjectId },
            score: { type: Number },
            // resultArray: { type: [Number] },
        },
    ],
}, { timestamps: true });





// Pre-middleware 
// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
});



// compare user entered password , with hashed password store in DB
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password)
}


// sign Access Token
UserSchema.methods.signAccessToken = function () {
    return jwt.sign({ _id: this._id, email: this.email, username: this.username }, process.env.ACCESS_TOKEN_SECRET || '', {
        expiresIn: '5m'
    })
}

// sign Refresh Token
UserSchema.methods.signRefreshToken = function () {
    return jwt.sign({ _id: this._id, email: this.email, username: this.username }, process.env.REFRESH_TOKEN_SECRET || '', {
        expiresIn: '3d'
    })
}




const UserModel: Model<IUser> = mongoose.model("User", UserSchema)
export default UserModel