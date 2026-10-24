import { Router, type IRouter } from "express";
import { editUserStatus, getMe, getUsers, updateMe } from "./user.controller";
import auth from "../../middleware/auth";

const userRouter: IRouter = Router();

userRouter.get("/me", auth(), getMe);
userRouter.put("/me", auth(), updateMe);
userRouter.patch("/me", auth(), updateMe);
userRouter.get("/", auth("ADMIN"), getUsers);
userRouter.patch("/:id", auth("ADMIN"), editUserStatus);

export default userRouter;
