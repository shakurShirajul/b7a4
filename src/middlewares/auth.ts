import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "../../prisma/generated/prisma/client";
import config from "../config";
import type { TJwtPayload } from "../modules/auth/auth.interface";

export const auth = (...requiredRoles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader?.startsWith("Bearer ")) {
                throw new Error("Authorization token is required");
            }

            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, config.jwt_access_secret) as TJwtPayload;

            if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
                throw new Error("You are not authorized");
            }

            req.user = decoded;
            next();
        } catch (error) {
            next(error);
        }
    };
};
