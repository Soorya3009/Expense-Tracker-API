import { Router } from "express";
import upload from "../middlewares/upload.middleware.js";
import { uploadImage, deleteImage } from "../controllers/upload.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/image",
  authenticateUser,
  upload.single("image"),
  uploadImage
);

router.delete(
  "/image",
  authenticateUser,
  deleteImage
);

export default router;
