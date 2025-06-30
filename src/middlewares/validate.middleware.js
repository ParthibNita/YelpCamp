import { CampgroundSchema, ReviewSchema } from "../utils/Schemas.js";
import { ApiError } from "../utils/ApiError.js";

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

export { validateCampground, validateReview };
