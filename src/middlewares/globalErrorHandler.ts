import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";
import { Prisma } from "../../prisma/generated/prisma/client";

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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const statusCodeByCode: Record<string, number> = {
            P2002: httpStatus.CONFLICT,
            P2003: httpStatus.CONFLICT,
            P2025: httpStatus.NOT_FOUND,
        };
        const messageByCode: Record<string, string> = {
            P2002: "Duplicate value violates a unique constraint",
            P2003: "Cannot delete this record because related data exists",
            P2025: "Record not found",
        };
        const statusCode = statusCodeByCode[error.code] || httpStatus.BAD_REQUEST;
        const message = messageByCode[error.code] || error.message;

        res.status(statusCode).json({
            success: false,
            message,
            errorDetails: [
                {
                    message,
                },
            ],
        });
        return;
    }

    const statusCode = error instanceof AppError
        ? error.statusCode
        : httpStatus.INTERNAL_SERVER_ERROR;

    const errorDetails: TErrorDetails[] = [
        {
            message: error.message || "Something went wrong",
        },
    ];

    res.status(statusCode).json({
        success: false,
        message: error.message || "Something went wrong",
        errorDetails,
    });
};
