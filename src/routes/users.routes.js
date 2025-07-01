import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

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

export default router;
