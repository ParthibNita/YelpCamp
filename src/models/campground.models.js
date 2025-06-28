import mongoose, { Schema } from "mongoose";

const campgroundSchema = new Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
});

export const Campground = mongoose.model("Campground", campgroundSchema);
