import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../interface/query.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import AppError from "../../utils/AppError";
import {
  CreateLandlordApplicationInput,
  landlordApplicationListQuerySchema,
  RejectLandlordApplicationInput,
} from "./landlordApplication.validation";

const createApplication = async (
  applicantId: string,
  payload: CreateLandlordApplicationInput,
) => {
  const existing = await prisma.landlordApplication.findFirst({
    where: { applicant_id: applicantId, status: "pending" },
    select: { id: true },
  });

  if (existing) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "You already have a pending landlord application",
    );
  }

  return prisma.landlordApplication.create({
    data: {
      ...payload,
      applicant_id: applicantId,
    },
  });
};

const getMyLatestApplication = async (applicantId: string) => {
  return prisma.landlordApplication.findFirst({
    where: { applicant_id: applicantId },
    orderBy: { created_at: "desc" },
  });
};

const listApplications = async (query: IQueryParams) => {
  const parsedQuery = landlordApplicationListQuerySchema.safeParse(query);
  if (!parsedQuery.success) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Invalid landlord application query parameters",
    );
  }

  const { status, searchTerm, page, limit } = parsedQuery.data;
  const queryBuilder = new QueryBuilder<
    Prisma.LandlordApplicationGetPayload<{
      include: {
        applicant: { select: { id: true; name: true; email: true } };
      };
    }>,
    Prisma.LandlordApplicationWhereInput,
    Prisma.LandlordApplicationInclude
  >(
    prisma.landlordApplication,
    {
      ...(searchTerm ? { searchTerm } : {}),
      ...(status ? { status } : {}),
      page: String(page),
      limit: String(limit),
    },
    {
      searchableFields: ["business_name", "applicant.name", "applicant.email"],
      filterableFields: ["status"],
      defaultSortBy: "created_at",
    },
  );

  return queryBuilder
    .search()
    .filter()
    .sort()
    .include({
      applicant: { select: { id: true, name: true, email: true } },
    })
    .paginate()
    .execute();
};

const getApplicationDetails = async (id: string) => {
  const application = await prisma.landlordApplication.findUnique({
    where: { id },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviewed_by: { select: { id: true, name: true, email: true } },
    },
  });

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Landlord application not found");
  }
  return application;
};

const approveApplication = async (id: string, reviewerId: string) => {
  const application = await prisma.landlordApplication.findUnique({
    where: { id },
    select: { id: true, applicant_id: true, status: true },
  });

  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Landlord application not found");
  }
  if (application.status !== "pending") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Only pending applications can be approved",
    );
  }

  try {
    // both writes succeed or fail together
    const [approved] = await prisma.$transaction([
      prisma.landlordApplication.update({
        where: { id, status: "pending" }, // race guard
        data: {
          status: "approved",
          reviewed_by_id: reviewerId,
          reviewed_at: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: application.applicant_id },
        data: { role: "LANDLORD" },
      }),
    ]);
    return approved;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "This application has already been processed",
      );
    }
    throw error;
  }
};

const rejectApplication = async (
  id: string,
  reviewerId: string,
  payload: RejectLandlordApplicationInput,
) => {
  const application = await prisma.landlordApplication.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (!application) {
    throw new AppError(StatusCodes.NOT_FOUND, "Landlord application not found");
  }
  if (application.status !== "pending") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Only pending applications can be rejected",
    );
  }

  return prisma.$transaction(async (tx) => {
    const result = await tx.landlordApplication.updateMany({
      where: { id, status: "pending" },
      data: {
        status: "rejected",
        rejection_reason: payload.reason,
        reviewed_by_id: reviewerId,
        reviewed_at: new Date(),
      },
    });
    if (result.count === 0) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "This application has already been processed",
      );
    }

    return tx.landlordApplication.findUniqueOrThrow({ where: { id } });
  });
};

export const landlordApplicationService = {
  createApplication,
  getMyLatestApplication,
  listApplications,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
};
