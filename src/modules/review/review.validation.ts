import { z } from "zod";

const idParamValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid review id"),
    }),
});

const propertyIdParamValidation = z.object({
    params: z.object({
        propertyId: z.coerce.number().int().positive("Invalid property id"),
    }),
});

const createReviewValidation = z.object({
    body: z.object({
        propertyId: z.coerce.number().int().positive("Invalid property id"),
        rentalId: z.coerce.number().int().positive("Invalid rental id"),
        rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
        comment: z.string().trim().optional(),
    }),
});

export const reviewValidation = {
    idParamValidation,
    propertyIdParamValidation,
    createReviewValidation,
};
