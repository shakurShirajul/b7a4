import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.userId;
    const payload = req.body;
    const review = await reviewService.createReviewIntoDB({...payload, tenantId: Number(tenantId) });
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Review created successfully",
        data: review
    })
})

export const reviewController = {
    createReview
}