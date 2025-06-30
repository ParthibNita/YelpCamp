import mongoose from "mongoose";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Campground } from "../models/campground.models.js";
import { validateCampground } from "../middlewares/validate.middleware.js";

const router = Router();

router.route("/").get(
  asyncHandler(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.route("/new").get((req, res) => {
  res.render("campgrounds/create");
});

router.route("/").post(
  validateCampground,
  asyncHandler(async (req, res) => {
    const { title, price, location, description, image } = req.body.campgrounds;
    const campground = new Campground({
      title,
      price,
      location,
      image,
      description,
    });
    await campground.save();
    res.redirect("/campgrounds");
    //   res.send(req.body);
  })
);

router.route("/:id").get(
  asyncHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next();
    }
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    // console.log(campground);
    if (!campground) {
      throw new ApiError(404, "Campground Not Found");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.route("/:id/edit").get(
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(404, "Invalid ID ");
    }
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      throw new ApiError(404, "Campground Not Found");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.route("/:id").put(
  validateCampground,
  asyncHandler(async (req, res) => {
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
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.route("/:id").delete(
  asyncHandler(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

export default router;
