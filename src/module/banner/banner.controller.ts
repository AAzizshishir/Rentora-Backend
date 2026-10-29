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

export const bannerController = {
  createBanner,
};
