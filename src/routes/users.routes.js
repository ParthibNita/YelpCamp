import mongoose from "mongoose";
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

const router = Router();

router.route("/register").get((_, res) => {
  res.render("users/register");
});

export default router;
