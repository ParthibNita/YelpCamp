import { Router } from "express";
import passport from "passport";
import { isLoggedIn, redirectRoute } from "../middlewares/auth.middleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/users.controller.js";

const router = Router();

router.route("/register").get((_, res) => {
  res.render("users/register");
});

router.route("/register").post(registerUser);

router.route("/login").get((_, res) => {
  res.render("users/login");
});

router.route("/login").post(
  redirectRoute,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/users/login",
  }),
  loginUser
);

router.route("/logout").get(isLoggedIn, logoutUser);

export default router;
