import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Campground } from "../models/campground.models.js";
import { Review } from "../models/reviews.models.js";
import {
  deleteFileOnCloudinary,
  uploadFileOnCloudinary,
} from "../utils/cloudinary.js";

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
  const redirectUrl = res.locals.returnTo || "/campgrounds";
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
  req.session.returnTo = req.originalUrl;
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/");
  }

  const campgrounds = await Campground.find({ author: user._id });
  const reviews = await Review.find({ author: user._id }).populate(
    "campground"
  );
  res.render("users/profile", { user, campgrounds, reviews });
});

const updateAvatar = asyncHandler(async (req, res) => {
  const user = req.profileUser;
  if (!user) {
    req.flash("error", "User not found");
    return res.redirect(`/`);
  }

  if (user.avatar && user.avatar.filename) {
    await deleteFileOnCloudinary(user.avatar.filename);
  }
  const avatarPath = req.file?.path;
  if (!avatarPath) {
    req.flash("error", "Please upload an image");
    return res.redirect(`/users/profile/${user.username}`);
  }

  const avatar = await uploadFileOnCloudinary(avatarPath, "Yelpcamp/users");
  if (!avatar.url) {
    req.flash("error", "Failed to upload avatar");
    return res.redirect(`/users/profile/${user.username}`);
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        avatar: {
          url: avatar.secure_url,
          filename: avatar.public_id,
        },
      },
    },
    { new: true }
  );

  req.flash("success", "Avatar updated successfully!");
  // console.log("before", req.session);
  res.redirect(`/users/profile/${user.username}`);
});

const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { username, email, bio } = req.body.user;
  const user = req.profileUser;
  const existingUser = await User.findOne({ username });
  if (existingUser && !existingUser._id.equals(user._id)) {
    req.flash("error", "Username already exists");
    return res.redirect(`/users/profile/${user.username}`);
  }
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        username,
        email,
        bio,
      },
    },
    { new: true }
  );
  // console.log("Updated User:", updatedUser);

  req.login(updatedUser, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Profile updated successfully!");
    res.redirect(`/users/profile/${updatedUser.username}`);
  });
});
export {
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  updateAvatar,
  updateUserProfile,
};
