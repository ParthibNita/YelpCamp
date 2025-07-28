import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // Create new user
    const user = new User({
      username,
      email,
    });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash(
        "success",
        `Hello <strong>${registeredUser.username}</strong>. Welcome to YelpCamp!`
      );
      res.redirect("/");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/users/register");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  req.flash("success", `Welcome back! <strong>${req.user.username}</strong>`);
  const redirectUrl = res.locals.returnTo || "/";
  res.redirect(redirectUrl);
});

const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/");
  });
};

const userProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  res.render("users/profile", { user });
});

export { registerUser, loginUser, logoutUser, userProfile };
