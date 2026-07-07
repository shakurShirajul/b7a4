import { z } from "zod";

const idParamValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid property id"),
    }),
});

const propertyBody = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().optional(),
    address: z.string().trim().min(1, "Address is required"),
    city: z.string().trim().min(1, "City is required"),
    state: z.string().trim().optional(),
    country: z.string().trim().min(1, "Country is required"),
    postalCode: z.string().trim().optional(),
    price: z.coerce.number().positive("Price must be greater than 0"),
    amenities: z.string().trim().min(1, "Amenities are required"),
    isAvailable: z.boolean().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).optional(),
    categoryId: z.coerce.number().int().positive("Invalid category id"),
});

const createPropertyValidation = z.object({
    body: propertyBody,
});

const updatePropertyValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid property id"),
    }),
    body: propertyBody.partial(),
});

export const propertyValidation = {
    idParamValidation,
    createPropertyValidation,
    updatePropertyValidation,
};
