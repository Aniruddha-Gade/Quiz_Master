import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';


// user interface
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
}


// user schema
const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
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




const UserModel: Model<IUser> = mongoose.model("User", UserSchema)
export default UserModel