import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const createReviewIntoDB = async (payload: ICreateReviewPayload) => {
    const { propertyId, tenantId, rentalId, rating, comment } = payload;

    const rental = await prisma.rental.findFirst({
        where: {
            id: rentalId,
            tenantId,
            propertyId,
        },
        include: {
            payments: true,
            review: true,
        },
    });

    if (!rental) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental not found for this tenant and property");
    }

    if (rental.review) {
        throw new AppError(httpStatus.CONFLICT, "Review already exists for this rental");
    }

    const hasCompletedPayment = rental.payments.some((payment) => payment.status === "COMPLETED");

    if (!hasCompletedPayment) {
        throw new AppError(httpStatus.BAD_REQUEST, "Review is allowed only after completed payment");
    }

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

const getAllReviewsFromDB = async () => {
    const reviews = await prisma.review.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            property: true,
            tenant: {
                omit: {
                    password: true,
                    refreshTokenHash: true,
                },
            },
        },
    });

    return reviews;
}

const getMyReviewsFromDB = async (tenantId: number) => {
    const reviews = await prisma.review.findMany({
        where: {
            tenantId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            property: true,
        },
    });

    return reviews;
}

const getPropertyReviewsFromDB = async (propertyId: number) => {
    const reviews = await prisma.review.findMany({
        where: {
            propertyId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            tenant: {
                omit: {
                    password: true,
                    refreshTokenHash: true,
                },
            },
        },
    });

    return reviews;
}


export const reviewService = {
    createReviewIntoDB,
    getAllReviewsFromDB,
    getMyReviewsFromDB,
    getPropertyReviewsFromDB
}
