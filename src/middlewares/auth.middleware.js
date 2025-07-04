import { Review } from "../models/reviews.models.js";

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please log in first");
    return res.redirect("/users/login");
  }
  next();
};

// Middleware to store redirect URL as recent passport.js version deletes the session after succesful login
const redirectRoute = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

const isAuthor = (req, res, next) => {
  const { id } = req.params;

  if (!req.user._id.equals(id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

export { isLoggedIn, redirectRoute, isAuthor, isReviewAuthor };
