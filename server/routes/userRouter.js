import express from "express"
import { auth } from "../middlewares/auth.js";
import { getPublishedCreation, getUserCreations, toggleLikeCreation } from "../controllers/userController.js";
const userRouter = express.Router();
userRouter.use('/get-user-creation' , auth , getUserCreations)
userRouter.use('/get-published-creation' , auth , getPublishedCreation)
userRouter.use('/togle-like-creation' , auth , toggleLikeCreation)

export default userRouter