import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  if (this.url && this.url.includes("cloudinary"))
    return this.url.replace("/upload", "/upload/w_100");
  else return this.url.replace(/\/\d+\/\d+/, "/200/150");
});

const campgroundSchema = new Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    location: {
      type: String,
    },
    images: [imageSchema],
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
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

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
