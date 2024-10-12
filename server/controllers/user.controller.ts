import { Response, Request, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import UserModel, { IUser } from '../models/user.model';
import ejs from 'ejs'
import path from 'path'
import ErrorHandler from '../utils/ErrorHandler';
import sendMail from '../utils/sendMail';
import { catchAsyncError } from '../utils/catchAsyncError';
import { sendToken } from '../utils/jwt';
require('dotenv').config()



// =========================== REGISTER USER ===========================
interface IRagistrationBody {
    username: string,
    email: string,
    password: string,
    accountType: 'Admin' | 'Student',
    year: string,
    department: string,
    regId: string,
    dob: Date,
}

export const registerUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password, accountType, year, department, regId, dob } = req.body as IRagistrationBody

        // validate data
        if (!username || !email || !password || !accountType || !department || !year || !regId || !dob) {
            return next(new ErrorHandler('All fields are required - username, email, password, accountType, year, department, regId, dob',
                400, "Error while registering user")
            )
        }

        // check user already exist or not
        const isUserAlreadyExist = await UserModel.findOne({ email })
        if (isUserAlreadyExist) {
            return next(new ErrorHandler('User already exist', 400, "Error while registering user"))
        }

        // create user data
        const user: IRagistrationBody = {
            username,
            email, password,
            accountType, year, department, regId, dob
        }

        // create token and OTP
        const activationToken = createActivationToken(user)
        const activationCode = activationToken.activationCode

        // send otp through email 
        const emailData = { user: { name: user.username, }, activationCode }
        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), emailData)


        try {
            await sendMail({
                email: email,
                subject: "Activate your account on 'Quiz_Master' Platform",
                template: html,
                emailData
            })

            // send success message
            res.status(201).json({
                success: true,
                activationToken: activationToken.token,
                message: `Please check your email : ${email} to activate your account`
            })
        } catch (error: any) {
            console.log(`Error while sending email to user with email : ${email} => `, error)
            return next(new ErrorHandler(error.message, 400, "Error while registering user"))
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400, "Error while registering user"))
    }
})



// create Activation Token
interface IActivationToken {
    token: string,
    activationCode: string
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        {
            user,
            activationCode
        },
        process.env.ACTIVATION_SECRET as Secret,
        {
            expiresIn: "5m"
        }
    );

    return { token, activationCode };
};




// =========================== ACTIVATE USER ===========================
interface IActivationRequest {
    activation_token: string,
    activation_code: string
}

export const activateUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code } = req.body as IActivationRequest;

        if (!activation_token || !activation_code) {
            return next(new ErrorHandler('activation_token and activation_code are required', 400, "Error while activating user"));
        }

        const newUser: { user: IUser; activationCode: string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string
        ) as { user: IUser; activationCode: string };


        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400, "Error while activating user"));
        }

        const { username, email, password, accountType, year, department, regId, dob } = newUser.user;
        // console.log({ name, email, password, accountType })

        // Store user data in the database
        const user = await UserModel.create({
            username,
            email, password,
            accountType, year, department, regId, dob
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully 👍",
        });
    } catch (error: any) {
        console.log(error);
        return next(new ErrorHandler(error.message, 400, "Error while activating user"));
    }
}
);







// =========================== LOGIN USER ===========================
interface ILoginRequest {
    email: string,
    password: string
}

export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginRequest

        // validate data
        if (!email || !password) {
            return next(new ErrorHandler('Please enter your email and password', 400, "Error while loging user"));
        }

        // check user has register or not
        const user = await UserModel.findOne({ email }).select('+password')
        if (!user) {
            return next(new ErrorHandler('Invalid email', 400, "Error while loging user"));
        }
        // console.log({ user })


        // compare user entered password , with hashed password store in DB
        const isPasswordMatch = await user.comparePassword(password)
        if (!isPasswordMatch) {
            return next(new ErrorHandler('Invalid password', 400, "Error while loging user"));
        }
        // set the password field to an empty string in the user object ,
        user.password = ''


        // send Token
        sendToken(user, 200, res)


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400, "Error while loging user"));
    }
})

