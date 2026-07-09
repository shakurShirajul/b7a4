import { z } from "zod";

const idParamValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid category id"),
    }),
});

const createCategoryValidation = z.object({
    body: z.object({
        name: z.string().trim().min(1, "Category name is required"),
        description: z.string().trim().optional(),
    }),
});

const updateCategoryValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid category id"),
    }),
    body: z.object({
        name: z.string().trim().min(1, "Category name is required"),
        description: z.string().trim().optional(),
    }).partial().refine((body) => Object.keys(body).length > 0, {
        message: "At least one field is required",
    }),
});

export const categoryValidation = {
    idParamValidation,
    createCategoryValidation,
    updateCategoryValidation,
};
