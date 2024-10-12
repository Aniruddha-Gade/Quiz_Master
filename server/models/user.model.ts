import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'



// user interface
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
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
    }
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