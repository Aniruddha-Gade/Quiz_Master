import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'


const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



interface IQuizResult {
    quizId: mongoose.Types.ObjectId; // Reference to the quiz
    score: number;                   // The user's score for that quiz
}

// user interface
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    accountType: 'Admin' | 'Student';
    year: string;
    department: string;
    regId: string;
    dob: Date;
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
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email"
        },
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ['Admin', 'Student'],
        default: "Student",
        reuired: true
    },
    year: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    regId: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
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