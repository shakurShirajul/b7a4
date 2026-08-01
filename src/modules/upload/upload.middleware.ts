import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import multer from "multer";
import { AppError } from "../../errors/AppError";
import { isAllowedImageMimeType } from "./upload.validation";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_IMAGE_SIZE,
        files: 1,
    },
    fileFilter: (_req, file, callback) => {
        if (!isAllowedImageMimeType(file.mimetype)) {
            callback(new AppError(
                httpStatus.BAD_REQUEST,
                "Only JPEG, PNG, and WebP images are allowed"
            ));
            return;
        }

        callback(null, true);
    },
}).single("image");

export const uploadSingleImage = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    imageUpload(req, res, (error) => {
        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
            next(new AppError(httpStatus.BAD_REQUEST, "Image must be 5 MB or smaller"));
            return;
        }

        if (error) {
            next(error);
            return;
        }

        next();
    });
};
