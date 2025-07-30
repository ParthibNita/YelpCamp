import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Campground } from "../models/campground.models.js";
import { Review } from "../models/reviews.models.js";

const postReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    throw new ApiError(404, "Campground Not Found");
  }
  if (campground.author.equals(req.user._id)) {
    req.flash("error", "You can't review your own campground!");
    return res.redirect(`/campgrounds/${id}`);
  }
  const review = new Review({
    ...req.body.reviews,
    author: req.user._id,
    campground: id,
  });
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/campgrounds/${id}`);
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {
    $pull: {
      reviews: reviewId,
    },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/campgrounds/${id}`);
});

export { postReview, deleteReview };
