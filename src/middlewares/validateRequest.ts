import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateRequest = (schema: z.ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedData = await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            }) as {
                body?: Request["body"];
                params?: Request["params"];
                query?: Record<string, unknown>;
            };

            req.body = parsedData.body ?? req.body;
            req.params = parsedData.params ?? req.params;
            req.validatedQuery = parsedData.query ?? req.query;

            next();
        } catch (error) {
            next(error);
        }
    };
};
