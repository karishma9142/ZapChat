import express from 'express';
import { cheakAuth, login, signup, updateProfile } from '../controllers/userController';
import { auth } from '../middleware/auth';

const userRouter = express.Router();

userRouter.post("/signup" , signup);
userRouter.post("/login" , login);
userRouter.put("/update-profile" , auth , updateProfile);
userRouter.get("/cheak" , auth , cheakAuth);

export default userRouter;