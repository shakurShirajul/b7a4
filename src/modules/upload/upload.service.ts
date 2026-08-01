import httpStatus from "http-status";
import config from "../../config";
import { AppError } from "../../errors/AppError";
import { ImgBBUploadResponse } from "./upload.interface";

const uploadImageToImgBB = async (file: Express.Multer.File) => {
    if (!config.imgbb_api_key) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "ImgBB API key is not configured"
        );
    }

    const body = new URLSearchParams({
        image: file.buffer.toString("base64"),
        name: file.originalname.replace(/\.[^.]+$/, ""),
    });

    let response: Response;

    try {
        response = await fetch(
            `https://api.imgbb.com/1/upload?key=${encodeURIComponent(config.imgbb_api_key)}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
            }
        );
    } catch {
        throw new AppError(httpStatus.BAD_GATEWAY, "Could not connect to ImgBB");
    }

    const result = await response.json() as ImgBBUploadResponse;

    if (!response.ok || !result.success || !result.data) {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            result.error?.message || "ImgBB image upload failed"
        );
    }

    return {
        id: result.data.id,
        title: result.data.title,
        url: result.data.display_url || result.data.image?.url || result.data.url,
        deleteUrl: result.data.delete_url,
        width: result.data.width,
        height: result.data.height,
        size: result.data.size,
        mimeType: file.mimetype,
    };
};

export const uploadService = {
    uploadImageToImgBB,
};
