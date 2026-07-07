import { z } from "zod";

const loginUserValidation = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    }),
});

const refreshTokenValidation = z.object({
    body: z.object({
        refreshToken: z.string().optional(),
    }).optional(),
});

export const authValidation = {
    loginUserValidation,
    refreshTokenValidation,
};
                     