import Joi from "joi";

const CampgroundSchema = Joi.object({
  campgrounds: Joi.object({
    title: Joi.string().max(10).required(),
    price: Joi.number().min(1).required(),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().allow(""),
  }).required(),
});

const ReviewSchema = Joi.object({
  reviews: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }).required(),
});

export { CampgroundSchema, ReviewSchema };
