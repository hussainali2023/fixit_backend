import { Router, type IRouter } from "express";
import { login, register } from "./auth.controller";

const authRouter: IRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;
