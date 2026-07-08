import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";

const getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await reviewService.getAllReviewsFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reviews fetched successfully",
        data: reviews
    })
})

const getMyReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.userId;

    if (!tenantId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authenticated");
    }

    const reviews = await reviewService.getMyReviewsFromDB(Number(tenantId));
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Reviews fetched successfully",
        data: reviews
    })
})

const getPropertyReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.propertyId;
    const reviews = await reviewService.getPropertyReviewsFromDB(Number(propertyId));
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property reviews fetched successfully",
        data: reviews
    })
})

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.userId;
    const payload = req.body;
    const review = await reviewService.createReviewIntoDB({...payload, tenantId: Number(tenantId) });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review created successfully",
        data: review
    })
})

export const reviewController = {
    getAllReviews,
    getMyReviews,
    getPropertyReviews,
    createReview
}
