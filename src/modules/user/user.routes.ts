import { Router, type IRouter } from "express";
import { editUserStatus, getMe, getUsers } from "./user.controller";
import auth from "../../middleware/auth";

const userRouter: IRouter = Router();

userRouter.get("/me", auth(), getMe);
userRouter.get("/", auth("ADMIN"), getUsers);
userRouter.patch("/:id", auth("ADMIN"), editUserStatus);

export default userRouter;
