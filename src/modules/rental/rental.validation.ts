import { z } from "zod";

const idParamValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid rental id"),
    }),
});

const createRentalValidation = z.object({
    body: z.object({
        propertyId: z.coerce.number().int().positive("Invalid property id"),
        message: z.string().trim().min(1, "Message is required"),
        moveInDate: z.coerce.date().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
    }),
});

const updateRentalValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid rental id"),
    }),
    body: z.object({
        message: z.string().trim().min(1, "Message is required"),
        moveInDate: z.coerce.date().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
    }),
});

const updateRentalStatusValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid rental id"),
    }),
    body: z.object({
        status: z.enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "COMPLETED", "CANCELLED"]),
    }),
});

export const rentalValidation = {
    idParamValidation,
    createRentalValidation,
    updateRentalValidation,
    updateRentalStatusValidation,
};
