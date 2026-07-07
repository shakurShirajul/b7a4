import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

type TErrorDetails = {
    path?: (string | number)[];
    message: string;
};

export const globalErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Validation failed",
            errorDetails: error.issues.map((issue) => ({
                path: issue.path,
                message: issue.message,
            })),
        });
        return;
    }

    const errorDetails: TErrorDetails[] = [
        {
            message: error.message || "Something went wrong",
        },
    ];

    res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || "Something went wrong",
        errorDetails,
    });
};
