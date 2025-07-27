import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Campground } from "../models/campground.models.js";
import {
  uploadFileOnCloudinary,
  deleteFileOnCloudinary,
} from "../utils/cloudinary.js";

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

const getNewCampground = (req, res) => {
  req.session.returnTo = req.originalUrl;
  res.render("campgrounds/create");
};

const createNewCampground = asyncHandler(async (req, res) => {
  const { title, price, location, description } = req.body.campgrounds;
  // console.log(req.files);
  const uploadedImages = await Promise.all(
    req.files?.map(async (file) => await uploadFileOnCloudinary(file.path))
  );
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
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  // console.log(campground);
  if (!campground) {
    req.flash("error", "Oops! Campground doesn't exist");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
});

const getEditCampground = asyncHandler(async (req, res) => {
  req.session.returnTo = req.originalUrl;
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

const postEditCampground = asyncHandler(async (req, res) => {
  const { title, price, location, description } = req.body.campgrounds;
  const uploadedImages = await Promise.all(
    req.files?.map(async (file) => await uploadFileOnCloudinary(file.path))
  );
  const newImages = uploadedImages.map((file) => ({
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
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Campground deleted successfully!");
  res.redirect("/campgrounds");
});

export {
  getAllCampgrounds,
  getNewCampground,
  createNewCampground,
  viewCampground,
  getEditCampground,
  postEditCampground,
  deleteCampground,
};
