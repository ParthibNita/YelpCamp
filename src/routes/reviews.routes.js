import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Campground } from "../models/campground.models.js";
import { Review } from "../models/reviews.models.js";
import { validateReview } from "../middlewares/validate.middleware.js";

const router = Router({ mergeParams: true });

router.route("/").post(
  validateReview,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      throw new ApiError(404, "Campground Not Found");
    }
    const review = new Review(req.body.reviews);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.route("/:reviewId").delete(
  asyncHandler(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
      $pull: {
        reviews: reviewId,
      },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/campgrounds/${id}`);
  })
);

export default router;
