import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.utils";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

type CreateBannerInput = Omit<
  Prisma.BannerCreateInput,
  | "id"
  | "imageUrl"
  | "imagePublicId"
  | "createdById"
  | "updatedById"
  | "createdAt"
  | "updatedAt"
>;
type UpdateBannerInput = Partial<
  Pick<
    Prisma.BannerUncheckedUpdateInput,
    | "title"
    | "subtitle"
    | "altText"
    | "ctaText"
    | "ctaLink"
    | "placement"
    | "sortOrder"
    | "isActive"
    | "startsAt"
    | "endsAt"
  >
>;

const createBanner = async (
  adminId: string,
  payload: CreateBannerInput,
  file: Express.Multer.File,
) => {
  if (!file) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Banner image is required");
  }

  // Step 1: if this throws, nothing was saved, so nothing to clean up
  const image = await uploadToCloudinary(file, "banners");

  try {
    // Step 2: DB create
    return await prisma.banner.create({
      data: {
        ...payload,
        imageUrl: image.url,
        imagePublicId: image.public_id,
        createdById: adminId,
      },
    });
  } catch (error) {
    // DB failed, so remove the uploaded image (compensating action)
    await deleteFromCloudinary(image.public_id).catch((cleanupError) => {
      console.error(
        "Failed to clean up Cloudinary image:",
        image.public_id,
        cleanupError,
      );
    });

    throw error; // rethrow so your error handler still responds with the real error
  }
};

const getAllBanners = async () => {
  const banners = await prisma.banner.findMany();
  return banners;
};

const updateBanner = async (
  adminId: string,
  id: string,
  payload: UpdateBannerInput,
  file?: Express.Multer.File,
) => {
  const existingBanner = await prisma.banner.findUnique({
    where: { id },
  });

  if (!existingBanner) {
    throw new AppError(StatusCodes.NOT_FOUND, "Banner not found");
  }

  const image = file ? await uploadToCloudinary(file, "banners") : undefined;

  let updatedBanner;
  try {
    updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        ...payload,
        ...(image && {
          imageUrl: image.url,
          imagePublicId: image.public_id,
        }),
        updatedById: adminId,
      },
    });
  } catch (error) {
    if (image) {
      try {
        await deleteFromCloudinary(image.public_id);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up replacement banner image:",
          cleanupError,
        );
      }
    }

    throw error;
  }

  if (image && existingBanner.imagePublicId) {
    await deleteFromCloudinary(existingBanner.imagePublicId);
  }

  return updatedBanner;
};

const deleteBanner = async (id: string) => {
  const banner = await prisma.banner.findUnique({
    where: { id },
    select: { id: true, imagePublicId: true },
  });

  if (!banner) {
    throw new AppError(StatusCodes.NOT_FOUND, "Banner not found");
  }

  await prisma.banner.delete({ where: { id } });

  if (banner.imagePublicId) {
    await deleteFromCloudinary(banner.imagePublicId);
  }

  return { message: "Banner deleted successfully" };
};

export const bannerService = {
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
};
