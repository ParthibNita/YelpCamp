import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Campground } from "../models/campground.models.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";

const getAllCampgrounds = asyncHandler(async (_, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

const getNewCampground = (_, res) => {
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
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

const postEditCampground = asyncHandler(async (req, res) => {
  const { title, price, location, image, description } = req.body.campgrounds;
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title,
        price,
        location,
        image,
        description,
      },
    },
    { new: true, runValidators: true }
  );
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
