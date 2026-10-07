import { Router } from "express";
import { propertyRoutes } from "../module/property/property.route";
import { unitRoutes } from "../module/unit/unit.routes";
import { userRoutes } from "../module/user/user.routes";
import { leaseApplication } from "../module/leaseApplication/leaseApplication.routes";
import { leaseRoutes } from "../module/lease/lease.routes";
import { paymentRoutes } from "../module/payment/payment.routes";
import { maintenanceRoutes } from "../module/maintenance/maintenance.routes";
import { noticeRoutes } from "../module/notice/notice.routes";
import {
  adminLandlordApplicationRoutes,
  landlordApplicationRoutes,
} from "../module/landlordApplication/landlordApplication.routes";

const router = Router();

// User
router.use("/users", userRoutes);

// Property Route
router.use("/properties", propertyRoutes);

// Unit Route
router.use("/unit", unitRoutes);

// Lease Application
router.use("/lease-application", leaseApplication);

// Lease
router.use("/lease", leaseRoutes);

// Payment
router.use("/payment", paymentRoutes);

// Maintenance
router.use("/maintenance", maintenanceRoutes);

// Notice
router.use("/notice", noticeRoutes);

// Landlord application
router.use("/landlord-applications", landlordApplicationRoutes);
router.use("/admin/landlord-applications", adminLandlordApplicationRoutes);

export const indexRoutes = router;
