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
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  description: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Middleware to delete associated reviews when a campground is deleted
campgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await mongoose.model("Review").deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

export const Campground = mongoose.model("Campground", campgroundSchema);
