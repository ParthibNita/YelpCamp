import { Router } from "express";
import {
  validateCampground,
  validateImageUploadLimit,
} from "../middlewares/validate.middleware.js";
import { isAuthor, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getAllCampgrounds,
  getNewCampground,
  createNewCampground,
  viewCampground,
  getEditCampground,
  postEditCampground,
  deleteCampground,
  likeCampground,
} from "../controllers/campgrounds.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router
  .route("/")
  .get(getAllCampgrounds)
  .post(
    isLoggedIn,
    upload.array("campgrounds[image]", 4),
    validateCampground,
    createNewCampground
  );

router.route("/new").get(isLoggedIn, getNewCampground);

router
  .route("/:id")
  .get(viewCampground)
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("campgrounds[image]", 4),
    validateImageUploadLimit,
    validateCampground,
    postEditCampground
  )
  .delete(isLoggedIn, isAuthor, deleteCampground);

router.route("/:id/edit").get(isLoggedIn, isAuthor, getEditCampground);

router.route("/:id/like").post(isLoggedIn, likeCampground);

export default router;
