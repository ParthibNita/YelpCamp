import mongoose from "mongoose";
import { Review } from "../models/reviews.models.js";
import { Campground } from "../models/campground.models.js";
import { User } from "../models/user.models.js";

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

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Campground ID");
    return res.redirect("/campgrounds");
  }
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground doesn't exist");
    return res.redirect("/campgrounds");
  }
  if (!campground.author.equals(req.user._id)) {
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

const isProfileAuthor = async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/");
  }
  if (!user._id.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/users/${username}`);
  }
  req.profileUser = user;
  next();
};

export { isLoggedIn, redirectRoute, isAuthor, isReviewAuthor, isProfileAuthor };
