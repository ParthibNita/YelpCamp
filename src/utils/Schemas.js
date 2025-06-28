import Joi from "joi";

const CampgroundSchema = Joi.object({
  campgrounds: Joi.object({
    title: Joi.string().max(10).required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().allow(""),
  }).required(),
});

export { CampgroundSchema };
