import { Router } from "express";
import { bannerController } from "./banner.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { Role } from "../../generated/prisma/enums";
import { upload } from "../../config/multer.config";

const router = Router();

router.post(
  "/",
  authMiddleware(Role.ADMIN),
  upload.single("image"),
  bannerController.createBanner,
);

export const bannerRoutes = router;
