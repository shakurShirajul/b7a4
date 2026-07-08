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
    images: z.array(z.string().url("Invalid image URL")).optional(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    amenities: z.string().trim().min(1, "Amenities are required"),
    isAvailable: z.boolean().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).optional(),
    categoryId: z.coerce.number().int().positive("Invalid category id"),
});

const propertyQueryValidation = z.object({
    query: z.object({
        searchTerm: z.string().trim().optional(),
        city: z.string().trim().optional(),
        country: z.string().trim().optional(),
        categoryId: z.coerce.number().int().positive("Invalid category id").optional(),
        minPrice: z.coerce.number().nonnegative("Minimum price cannot be negative").optional(),
        maxPrice: z.coerce.number().nonnegative("Maximum price cannot be negative").optional(),
        amenities: z.string().trim().optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).optional(),
        isAvailable: z.coerce.boolean().optional(),
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().positive().max(100).optional(),
        sortBy: z.enum(["createdAt", "price", "title", "city"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
    }).refine((query) => {
        if (query.minPrice === undefined || query.maxPrice === undefined) {
            return true;
        }

        return query.minPrice <= query.maxPrice;
    }, {
        message: "Minimum price cannot be greater than maximum price",
        path: ["minPrice"],
    }),
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
    propertyQueryValidation,
    createPropertyValidation,
    updatePropertyValidation,
};
