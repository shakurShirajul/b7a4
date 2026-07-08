import { z } from "zod";

const idParamValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid user id"),
    }),
});

const registerUserValidation = z.object({
    body: z.object({
        name: z.string().trim().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        phone: z.string().trim().optional(),
        role: z.enum(["TENANT", "LANDLORD"]).optional(),
    }),
});

const updateUserValidation = z.object({
    body: z.object({
        name: z.string().trim().min(1, "Name cannot be empty").optional(),
        email: z.string().email("Invalid email address").optional(),
        password: z.string().min(6, "Password must be at least 6 characters long").optional(),
        phone: z.string().trim().optional(),
        avatarUrl: z.string().url("Invalid avatar URL").optional(),
    }),
});

const updateUserStatusValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid user id"),
    }),
    body: z.object({
        status: z.enum(["ACTIVE", "BANNED"]),
    }),
});

export const userValidation = {
    idParamValidation,
    registerUserValidation,
    updateUserValidation,
    updateUserStatusValidation,
};
