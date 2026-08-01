import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { uploadService } from "./upload.service";

const uploadImage = catchAsync(async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (!req.file) {
        throw new AppError(httpStatus.BAD_REQUEST, "Image file is required");
    }

    const image = await uploadService.uploadImageToImgBB(req.file);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Image uploaded successfully",
        data: image,
    });
});

export const uploadController = {
    uploadImage,
};
