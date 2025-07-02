import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import passport from "passport";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").get((_, res) => {
  res.render("users/register");
});
router.route("/register").post(
  asyncHandler(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      // Create new user
      const user = new User({
        username,
        email,
      });
      const registeredUser = await User.register(user, password);
      req.flash(
        "success",
        `Hello <strong>${registeredUser.username}</strong>. Welcome to YelpCamp!`
      );
      res.redirect("/campgrounds");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/users/register");
    }
  })
);

router.route("/login").get((_, res) => {
  res.render("users/login");
});
router.route("/login").post(
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/users/login",
  }),
  asyncHandler(async (req, res) => {
    req.flash("success", `Welcome back! <strong>${req.user.username}</strong>`);
    res.redirect("/campgrounds");
  })
);

router.route("/logout").get(isLoggedIn, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/campgrounds");
  });
});

export default router;
