import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import type { TAuthTokens, TJwtPayload, TLoginPayload } from "./auth.interface";

const getRefreshTokenExpiresAt = () => {
    const expiresIn = config.jwt_refresh_expires_in || "30d";
    const value = Number.parseInt(expiresIn, 10);
    const unit = expiresIn.replace(String(value), "");

    const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    const multiplier = multipliers[unit] || multipliers.d;
    const duration = Number.isNaN(value) ? 30 * multipliers.d : value * multiplier;

    return new Date(Date.now() + duration);
};

const createToken = (payload: TJwtPayload, secret: Secret, expiresIn: string) => {
    const options: SignOptions = {
        expiresIn: expiresIn as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, secret, options);
};

const createAuthTokens = (payload: TJwtPayload): TAuthTokens => {
    const accessToken = createToken(
        payload,
        config.jwt_access_secret,
        config.jwt_access_expires_in
    );

    const refreshToken = createToken(
        payload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in
    );

    return {
        accessToken,
        refreshToken,
    };
};

const saveRefreshToken = async (userId: number, refreshToken: string) => {
    const refreshTokenHash = await bcrypt.hash(refreshToken, Number(config.bcrypt_salt_rounds));

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            refreshTokenHash,
            refreshTokenExpiresAt: getRefreshTokenExpiresAt(),
        },
    });
};

const loginUser = async (payload: TLoginPayload) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
        throw new Error("User account is not active");
    }

    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Invalid email or password");
    }

    const tokenPayload: TJwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const tokens = createAuthTokens(tokenPayload);

    await saveRefreshToken(user.id, tokens.refreshToken);

    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        },
    };
};

const refreshToken = async (token: string) => {
    let decoded: TJwtPayload;

    try {
        decoded = jwt.verify(token, config.jwt_refresh_secret) as TJwtPayload;
    } catch {
        throw new Error("Invalid refresh token");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.userId,
        },
    });

    if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
        throw new Error("Invalid refresh token");
    }

    if (user.status !== "ACTIVE") {
        throw new Error("User account is not active");
    }

    if (user.refreshTokenExpiresAt < new Date()) {
        throw new Error("Refresh token expired");
    }

    const isTokenMatched = await bcrypt.compare(token, user.refreshTokenHash);

    if (!isTokenMatched) {
        throw new Error("Invalid refresh token");
    }

    const tokenPayload: TJwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const tokens = createAuthTokens(tokenPayload);

    await saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
};

const logoutUser = async (token: string) => {
    try {
        const decoded = jwt.verify(token, config.jwt_refresh_secret) as TJwtPayload;

        await prisma.user.update({
            where: {
                id: decoded.userId,
            },
            data: {
                refreshTokenHash: null,
                refreshTokenExpiresAt: null,
            },
        });
    } catch {
        // Logout should still clear the client cookie even if the token is already invalid.
    }
};

export const authService = {
    loginUser,
    refreshToken,
    logoutUser,
};
