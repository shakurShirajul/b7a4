import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAllUsersFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users fetched successfully",
        data: users
    })
})

const getUserById = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserByIdFromDB(Number(req.params.id));
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User fetched successfully",
        data: user
    })
})

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    console.log("Payload received in controller:", payload); // Debugging line

    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: user
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        throw new Error("You are not authenticated");
    }

    const user = await userService.updateUserIntoDB(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User updated successfully",
        data: user
    })
})

const udpateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {  
    const userId = req.params.id;
    const { status } = req.body;

    const user = await userService.updateStatusIntoDB(Number(userId), status);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User status updated successfully",
        data: user
    })
})

export const userController = {
    getAllUsers,
    getUserById,
    registerUser,
    updateUser,
    udpateUserStatus
}
