import { Router } from "express";
import { activateUser, registerUser } from '../controllers/user.controller';

const userRouter = Router()

userRouter.post('/registration', registerUser)
userRouter.post('/activate-user', activateUser)



export default userRouter