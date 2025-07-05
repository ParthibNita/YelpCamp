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

const router = Router();

router.route("/").get(getAllCampgrounds);

router.route("/new").get(isLoggedIn, getNewCampground);

router.route("/").post(isLoggedIn, validateCampground, createNewCampground);

router.route("/:id").get(viewCampground);

router.route("/:id/edit").get(isLoggedIn, isAuthor, getEditCampground);

router
  .route("/:id")
  .put(isLoggedIn, isAuthor, validateCampground, postEditCampground);

router.route("/:id").delete(isLoggedIn, isAuthor, deleteCampground);

export default router;
