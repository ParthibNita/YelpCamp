import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Campground } from "../models/campground.models.js";
import {
  uploadFileOnCloudinary,
  deleteFileOnCloudinary,
} from "../utils/cloudinary.js";
import { Review } from "../models/reviews.models.js";
import { User } from "../models/user.models.js";

const getAllCampgrounds = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const totalCampgrounds = await Campground.countDocuments();
  const totalPages = Math.ceil(totalCampgrounds / limit);
  const campgrounds = await Campground.find({}).skip(skip).limit(limit);
  res.render("campgrounds/index", {
    campgrounds,
    currentPage: page,
    totalPages,
  });
});

const getNewCampground = (_, res) => {
  // req.session.returnTo = req.originalUrl;
  res.render("campgrounds/create");
};

const createNewCampground = asyncHandler(async (req, res) => {
  const { title, price, location, description } = req.body.campgrounds;
  // console.log(req.files);
  if (!req.files || req.files.length === 0) {
    req.flash("error", "Please upload at least one image");
    return res.redirect("/campgrounds/new");
  }
  const uploadedImages = await Promise.all(
    req.files?.map(
      async (file) =>
        await uploadFileOnCloudinary(file.path, "Yelpcamp/campgrounds")
    )
  );
  if (uploadedImages.length === 0) {
    req.flash("error", "Please upload at least one image");
    return res.redirect("/campgrounds/new");
  }
  // console.log(uploadedImages);

  const campground = new Campground({
    title,
    price,
    location,
    images: uploadedImages.map((file) => ({
      url: file.secure_url,
      filename: file.public_id,
    })),
    description,
    author: req.user._id,
  });
  await campground.save();
  req.flash("success", "Campground created successfully!");
  res.redirect(`/campgrounds/${campground._id}`);
  // res.send("Done");
});

const viewCampground = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    req.flash("error", "Invalid Campground ID");
    return res.redirect("/campgrounds");
  }
  const campground = await Campground.findById(req.params.id).populate(
    "author"
  );
  if (!campground) {
    req.flash("error", "Oops! Campground doesn't exist");
    return res.redirect("/campgrounds");
  }

  const reviewPage = parseInt(req.query.reviewPage) || 1;
  const limit = 5;
  const skip = (reviewPage - 1) * limit;
  const totalReviews = await Review.countDocuments({
    _id: { $in: campground.reviews },
  });
  const totalPages = Math.ceil(totalReviews / limit);
  const reviews = await Review.find({ _id: { $in: campground.reviews } })
    .skip(skip)
    .limit(limit)
    .populate("author");
  // console.log(campground);
  res.render("campgrounds/show", {
    campground,
    reviews,
    currentPage: reviewPage,
    totalPages,
  });
});

const getEditCampground = asyncHandler(async (req, res) => {
  // req.session.returnTo = req.originalUrl;
  const campground = req.yourCampground;
  res.render("campgrounds/edit", { campground });
});

const postEditCampground = asyncHandler(async (req, res) => {
  const { title, price, location, description } = req.body.campgrounds;
  const uploadedImages = await Promise.all(
    req.files?.map(
      async (file) =>
        await uploadFileOnCloudinary(file.path, "Yelpcamp/campgrounds")
    )
  );
  const newImages = uploadedImages?.map((file) => ({
    url: file.secure_url,
    filename: file.public_id,
  }));
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title,
        price,
        location,
        description,
      },
      $push: {
        images: {
          $each: newImages,
        },
      },
    },
    { new: true, runValidators: true }
  );
  console.log(req.body.deletedImages);
  if (req.body.deletedImages) {
    req.body.deletedImages.forEach(async (filename) => {
      await deleteFileOnCloudinary(filename);
    });
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deletedImages } } },
    });
  }

  req.flash("success", "Successfully edited campground!");
  res.redirect(`/campgrounds/${campground._id}`);
});

const deleteCampground = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }
  if (campground.images && campground.images.length > 0) {
    await Promise.all(
      campground.images.map(async (image) => {
        await deleteFileOnCloudinary(image.filename);
      })
    );
  }
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground deleted successfully!");
  res.redirect("/campgrounds");
});

const likeCampground = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }
  const isLiked = campground.likes.includes(req.user._id);
  if (isLiked) {
    //unliking
    await campground.updateOne({
      $pull: { likes: req.user._id },
      $inc: { likeCount: -1 },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { likedCampgrounds: id },
    });
    req.flash("success", "Unliked Campground");
  } else {
    //liking
    await campground.updateOne({
      $push: { likes: req.user._id },
      $inc: { likeCount: 1 },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { likedCampgrounds: id },
    });
    req.flash("success", "Liked Campground");
  }
  res.redirect(req.header("Referer"));
});

export {
  getAllCampgrounds,
  getNewCampground,
  createNewCampground,
  viewCampground,
  getEditCampground,
  postEditCampground,
  deleteCampground,
  likeCampground,
};
