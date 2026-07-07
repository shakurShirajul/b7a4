import { z } from "zod";

const createReviewValidation = z.object({
    body: z.object({
        propertyId: z.coerce.number().int().positive("Invalid property id"),
        rentalId: z.coerce.number().int().positive("Invalid rental id"),
        rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
        comment: z.string().trim().optional(),
    }),
});

export const reviewValidation = {
    createReviewValidation,
};
