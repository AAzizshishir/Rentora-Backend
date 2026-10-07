import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { authMiddleware } from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/validateRequest";
import { landlordApplicationController } from "./landlordApplication.controller";
import {
  createLandlordApplicationSchema,
  rejectLandlordApplicationSchema,
} from "./landlordApplication.validation";

const tenantRouter = Router();
tenantRouter.post(
  "/",
  authMiddleware(Role.TENANT),
  validateRequest(createLandlordApplicationSchema),
  landlordApplicationController.createApplication,
);
tenantRouter.get(
  "/me",
  authMiddleware(Role.TENANT, Role.LANDLORD),
  landlordApplicationController.getMyLatestApplication,
);

const adminRouter = Router();
adminRouter.use(authMiddleware(Role.ADMIN));
adminRouter.get("/", landlordApplicationController.listApplications);
adminRouter.get("/:id", landlordApplicationController.getApplicationDetails);
adminRouter.patch(
  "/:id/approve",
  landlordApplicationController.approveApplication,
);
adminRouter.patch(
  "/:id/reject",
  validateRequest(rejectLandlordApplicationSchema),
  landlordApplicationController.rejectApplication,
);

export const landlordApplicationRoutes = tenantRouter;
export const adminLandlordApplicationRoutes = adminRouter;
