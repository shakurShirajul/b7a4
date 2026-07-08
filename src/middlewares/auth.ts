import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "../../prisma/generated/prisma/client";
import config from "../config";
import type { TJwtPayload } from "../modules/auth/auth.interface";
import { AppError } from "../errors/AppError";
import httpStatus from "http-status";

export const auth = (...requiredRoles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader?.startsWith("Bearer ")) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Authorization token is required");
            }

            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, config.jwt_access_secret) as TJwtPayload;

            if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
                throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
            }

            req.user = decoded;
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                next(new AppError(httpStatus.UNAUTHORIZED, "Token expired"));
                return;
            }

            if (error instanceof jwt.JsonWebTokenError) {
                next(new AppError(httpStatus.UNAUTHORIZED, "Invalid token"));
                return;
            }

            next(error);
        }
    };
};
