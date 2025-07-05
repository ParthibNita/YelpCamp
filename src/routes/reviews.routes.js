import { Router } from "express";
import { validateReview } from "../middlewares/validate.middleware.js";
import { isLoggedIn, isReviewAuthor } from "../middlewares/auth.middleware.js";
import { deleteReview, postReview } from "../controllers/reviews.controller.js";

const router = Router({ mergeParams: true });

router.route("/").post(isLoggedIn, validateReview, postReview);

router.route("/:reviewId").delete(isLoggedIn, isReviewAuthor, deleteReview);

export default router;
