import { z } from "zod";

const idParamValidation = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("Invalid payment id"),
    }),
});

const createPaymentValidation = z.object({
    body: z.object({
        rentalId: z.coerce.number().int().positive("Invalid rental id"),
    }),
});

const confirmPaymentValidation = z.object({
    body: z.object({
        sessionId: z.string().min(1, "Stripe session id is required"),
    }),
});

export const paymentValidation = {
    idParamValidation,
    createPaymentValidation,
    confirmPaymentValidation,
};
