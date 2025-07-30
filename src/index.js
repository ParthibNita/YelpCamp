import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { ApiError } from "./utils/ApiError.js";

dotenv.config({
  path: ".env",
}); // Load environment variables from .env file

//Routes
app.get("/", (_, res) => {
  res.render("home");
});

// User routes
import userRoutes from "./routes/users.routes.js";
app.use("/users", userRoutes);

// Campgrounds routes
import campgroundRoutes from "./routes/campgrounds.routes.js";
app.use("/campgrounds", campgroundRoutes);

//Reviews routes
import reviewRoutes from "./routes/reviews.routes.js";
app.use("/campgrounds/:id/reviews", reviewRoutes);

// Error handling for undefined routes
app.all("*all", (_, __, next) => {
  next(new ApiError(404, "Page Not Found"));
});

//error middleware
app.use((err, req, res, __) => {
  const handleUploadError = (message) => {
    req.flash("error", message);
    req.session.save(() => res.redirect(req.session.returnTo));
  };

  if (err.message === "Invalid_File_Type") {
    return handleUploadError(
      "Invalid file type. Only JPEG, JPG, and PNG are allowed."
    );
  }
  if (err.message === "File too large") {
    return handleUploadError("File size exceeds the maximum limit of 5MB.");
  }
  if (err.message === "Unexpected field") {
    return handleUploadError("You cannot upload more than the specified limit");
  }
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
