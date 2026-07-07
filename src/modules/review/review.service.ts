import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const createReviewIntoDB = async (payload: ICreateReviewPayload) => {
    const { propertyId, tenantId, rentalId, rating, comment } = payload;
    const review = await prisma.review.create({
        data: {
            propertyId,
            tenantId,
            rentalId,
            rating,
            comment
        }
    })
    return review;
}


export const reviewService = {
    createReviewIntoDB
}