import { CampgroundSchema, ReviewSchema } from "../utils/Schemas.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";

const validateCampground = (req, _, next) => {
  //   console.log(req.body);
  const { error } = CampgroundSchema.validate(req.body);
  //   console.log(error);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ApiError(400, msg);
  } else {
    next();
  }
};
const validateReview = (req, _, next) => {
  const { error } = ReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ApiError(400, msg);
  } else {
    next();
  }
};

const validateImageUploadLimit = async (req, res, next) => {
  const maxCount = 4;
  const campground = req.yourCampground;

  const existingImageCount = campground.images.length;
  const newImageCount = req.files ? req.files.length : 0;
  const totalImages = existingImageCount + newImageCount;

  if (totalImages > maxCount) {
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        fs.unlinkSync(file.path);
      }
    }

    next(new ApiError(400, "Unexpected field"));
  }
  next();
};

export { validateCampground, validateReview, validateImageUploadLimit };
