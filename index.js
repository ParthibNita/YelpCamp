import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/index.js";
import { Campground } from "./models/campground.models.js";
import methodOverride from "method-override";
import engine from "ejs-mate";
import { asyncHandler } from "./utils/asyncHandler.js";
import { ApiError } from "./utils/ApiError.js";
import mongoose from "mongoose";
import { CampgroundSchema } from "./utils/Schemas.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

dotenv.config({
  path: ".env",
}); // Load environment variables from .env file

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(methodOverride("_method")); // Middleware to support PUT, PATCH and DELETE methods in forms

app.engine("ejs", engine); // Use ejs-mate for EJS templating
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const validateSchema = (req, _, next) => {
  // console.log(req.body);
  const { error } = CampgroundSchema.validate(req.body);
  // console.log(error);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ApiError(400, msg);
  } else {
    next();
  }
};

//Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  asyncHandler(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/create");
});

app.post(
  "/campgrounds",
  validateSchema,
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

app.get(
  "/campgrounds/:id",
  asyncHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next();
    }
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      throw new ApiError(404, "Campground Not Found");
    }
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
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

app.put(
  "/campgrounds/:id",
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

app.delete(
  "/campgrounds/:id",
  asyncHandler(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

app.all("*all", (req, res, next) => {
  next(new ApiError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});
//Database connection and server start
connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process with failure
  });
