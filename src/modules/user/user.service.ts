import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload, UpdateUserPayload } from "./user.interface";
import { Role, UserStatus } from "../../../prisma/generated/prisma/client";


const getAllUsersFromDB = async () => {
    const users = await prisma.user.findMany({
        omit: {
            password: true
        }
    });
    return users;
}

const getUserByIdFromDB = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    })
    return user;
}

const registerUserIntoDB = async (userData: RegisterUserPayload) => {
    const { name, email, password, role } = userData;

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExist) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
    const userRole = role ?? Role.TENANT;

    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: userRole
        }
    });

    return createUser;
}

const updateUserIntoDB = async (userId: number, userData: UpdateUserPayload) => {
    const { name, email, password, phone, avatarUrl } = userData;
    const hashedPassword = password
        ? await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))
        : undefined;

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            avatarUrl
        },
        omit: {
            password: true
        }
    });
    return updatedUser;
}

const updateStatusIntoDB = async (userId: number, status: UserStatus) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }
    
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status
        },
        omit: {
            password: true
        }
    });
    return updatedUser;
}

export const userService = {
    getAllUsersFromDB,
    getUserByIdFromDB,
    registerUserIntoDB,
    updateUserIntoDB,
    updateStatusIntoDB
}
