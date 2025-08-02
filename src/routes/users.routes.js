import { Router } from "express";
import passport from "passport";
import {
  isLoggedIn,
  isProfileAuthor,
  redirectRoute,
} from "../middlewares/auth.middleware.js";
import {
  deleteUser,
  getLoginForm,
  loginUser,
  logoutUser,
  registerUser,
  updateAvatar,
  updateUserProfile,
  userProfile,
} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .get((_, res) => {
    res.render("users/register");
  })
  .post(registerUser);

// router.route("/register").post(registerUser);

router
  .route("/login")
  .get(getLoginForm)
  .post(
    redirectRoute,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/users/login",
    }),
    loginUser
  );

router.route("/logout").get(isLoggedIn, logoutUser);

router
  .route("/profile/:username")
  .get(isLoggedIn, userProfile)
  .put(isLoggedIn, isProfileAuthor, updateUserProfile)
  .delete(isLoggedIn, isProfileAuthor, deleteUser);

router
  .route("/profile/:username/avatar")
  .put(
    isLoggedIn,
    isProfileAuthor,
    upload.single("user[avatar]"),
    updateAvatar
  );
export default router;
