import { Router } from "express";
import { validateCampground } from "../middlewares/validate.middleware.js";
import { isAuthor, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getAllCampgrounds,
  getNewCampground,
  createNewCampground,
  viewCampground,
  getEditCampground,
  postEditCampground,
  deleteCampground,
} from "../controllers/campgrounds.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router
  .route("/")
  .get(getAllCampgrounds)
  .post(
    isLoggedIn,
    validateCampground,
    upload.array("campgrounds[image]", 4),
    createNewCampground
  );

router.route("/new").get(isLoggedIn, getNewCampground);

router
  .route("/:id")
  .get(viewCampground)
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    upload.array("campgrounds[image]", 4),
    postEditCampground
  )
  .delete(isLoggedIn, isAuthor, deleteCampground);

router.route("/:id/edit").get(isLoggedIn, isAuthor, getEditCampground);

export default router;
