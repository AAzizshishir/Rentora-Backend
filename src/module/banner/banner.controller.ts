import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bannerService } from "./banner.service";
import { Request, Response } from "express";

// Create Banner
const createBanner = catchAsync(async (req: Request, res: Response) => {
  const admin_id = req?.user?.id;
  const imageFile = req.file as Express.Multer.File;
  const payload = {
    ...req.body,
  };
  console.log("Request body:", req.body);
  console.log("Request file:", imageFile);

  const banner = await bannerService.createBanner(
    admin_id as string,
    payload,
    imageFile,
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Banner created successfully",
    data: banner,
  });
});

// Get All Banners
const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const banners = await bannerService.getAllBanners();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Banners retrieved successfully",
    data: banners,
  });
});

// Update Banner
const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user?.id;
  const imageFile = req.file as Express.Multer.File | undefined;
  const banner = await bannerService.updateBanner(
    adminId as string,
    req.params.id as string,
    req.body,
    imageFile,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Banner updated successfully",
    data: banner,
  });
});

// Delete Banner
const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerService.deleteBanner(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const bannerController = {
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
};
