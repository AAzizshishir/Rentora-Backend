import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IQueryParams } from "../../interface/query.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { landlordApplicationService } from "./landlordApplication.service";

const createApplication = catchAsync(async (req: Request, res: Response) => {
  const application = await landlordApplicationService.createApplication(
    req.user!.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Landlord application submitted successfully",
    data: application,
  });
});

const getMyLatestApplication = catchAsync(
  async (req: Request, res: Response) => {
    const application =
      await landlordApplicationService.getMyLatestApplication(req.user!.id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Latest landlord application fetched successfully",
      data: application,
    });
  },
);

const listApplications = catchAsync(async (req: Request, res: Response) => {
  const result = await landlordApplicationService.listApplications(
    req.query as IQueryParams,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Landlord applications fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getApplicationDetails = catchAsync(
  async (req: Request, res: Response) => {
    const application = await landlordApplicationService.getApplicationDetails(
      req.params.id as string,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Landlord application fetched successfully",
      data: application,
    });
  },
);

const approveApplication = catchAsync(async (req: Request, res: Response) => {
  const application = await landlordApplicationService.approveApplication(
    req.params.id as string,
    req.user!.id,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Landlord application approved successfully",
    data: application,
  });
});

const rejectApplication = catchAsync(async (req: Request, res: Response) => {
  const application = await landlordApplicationService.rejectApplication(
    req.params.id as string,
    req.user!.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Landlord application rejected successfully",
    data: application,
  });
});

export const landlordApplicationController = {
  createApplication,
  getMyLatestApplication,
  listApplications,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
};
