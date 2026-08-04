import { Router, type IRouter } from "express";
import auth from "../../middleware/auth";
import { addReview, getReviews } from "./review.controller";

const reviewRouter: IRouter = Router();

reviewRouter.get("/", getReviews);
reviewRouter.post("/", auth("CUSTOMER"), addReview);

export default reviewRouter;
