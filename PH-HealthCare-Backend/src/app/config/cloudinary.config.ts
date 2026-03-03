import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envConfig } from "./env";
import AppError from "../../errorHelper/appError";
import { StatusCodes } from "http-status-codes";

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = cloudinary;

export const uploadFileCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  const extension = fileName.split(".").pop()?.toLocaleLowerCase();

  const fileNameWithOutExtension = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLowerCase()
    .replace(/\s+/g, "-")
    // eslint-disable-next-line no-useless-escape
    .replace(/[^a-z0-9\-]/g, "");

  const uniqueName =
    Math.random().toString(36).substring(2) +
    "-" +
    Date.now() +
    "-" +
    fileNameWithOutExtension;

  const folder = extension === "pdf" ? "pdfs" : "images";

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          public_id: `ph-healthcare/${folder}/${uniqueName}`,
          folder: `ph-healthcare/${folder}`,
        },
        (error, result) => {
          if (error) {
            return reject(
              new AppError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to upload file to Cloudinary",
              ),
            );
          }
          resolve(result as UploadApiResponse);
        },
      )
      .end(buffer);
  });
};

export const cloudinaryDelete = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;

    const match = url.match(regex);

    if (match && match[1]) {
      const publicId = match[1];

      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.log(error);
    throw new AppError(StatusCodes.FAILED_DEPENDENCY, "deleted failed");
  }
};
