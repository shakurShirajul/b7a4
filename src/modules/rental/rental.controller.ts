import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync"
import { rentalService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const userId = req.user?.userId;
    let rentals;

    if (userRole === "ADMIN") {
        rentals = await rentalService.getAllRentalsFromDB();
    } else if (userRole === "TENANT") {
        rentals = await rentalService.getAllRentalsFromDB({ tenantId: Number(userId) });
    } else if (userRole === "LANDLORD") {
        rentals = await rentalService.getAllRentalsFromDB({ landLordId: Number(userId) });
    } else {
        throw new Error("You are not authorized");
    }

    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Requests fetched successfully",
        data: rentals
    })
})

const getRentalById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rentalId = req.params.id;
    const rental = await rentalService.getRentalByIdFromDB(Number(rentalId));
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental fetched successfully",
        data: rental
    })
})

const createRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const updateRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const deleteRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

export const rentalController = {
    getAllRentals,
    getRentalById,
    createRental,
    updateRental,
    deleteRental
}
