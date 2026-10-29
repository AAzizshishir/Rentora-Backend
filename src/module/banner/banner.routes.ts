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

router.get("/", bannerController.getAllBanners);

router.patch(
  "/:id",
  authMiddleware(Role.ADMIN),
  upload.single("image"),
  bannerController.updateBanner,
);

router.delete(
  "/:id",
  authMiddleware(Role.ADMIN),
  bannerController.deleteBanner,
);

export const bannerRoutes = router;
