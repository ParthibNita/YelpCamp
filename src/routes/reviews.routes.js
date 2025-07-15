import { Router } from "express";
import { validateReview } from "../middlewares/validate.middleware.js";
import { isLoggedIn, isReviewAuthor } from "../middlewares/auth.middleware.js";
import { deleteReview, postReview } from "../controllers/reviews.controller.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(isLoggedIn, validateReview, (req, res) => {
    res.redirect(`/campgrounds/${req.params.id}`);
  })
  .post(isLoggedIn, validateReview, postReview);

router
  .route("/:reviewId")
  .get(isLoggedIn, isReviewAuthor, (req, res) => {
    res.redirect(`/campgrounds/${req.params.id}`);
  })
  .delete(isLoggedIn, isReviewAuthor, deleteReview);

export default router;
