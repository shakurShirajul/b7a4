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
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    let rental;

    if (userRole === "ADMIN") {
        rental = await rentalService.getRentalByIdFromDB(Number(rentalId));
    } else if (userRole === "TENANT") {
        rental = await rentalService.getRentalByIdFromDB(Number(rentalId), { tenantId: Number(userId) });
    } else if (userRole === "LANDLORD") {
        rental = await rentalService.getRentalByIdFromDB(Number(rentalId), { landLordId: Number(userId) });
    } else {
        throw new Error("You are not authorized");
    }

    if (!rental) {
        throw new Error("Rental not found");
    }

    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental fetched successfully",
        data: rental
    })
})

const createRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const { message, propertyId } = req.body;
    const rental = await rentalService.createRentalIntoDB({ message, propertyId, tenantId: Number(userId) });
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental created successfully",
        data: rental
    })
})

const updateRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const rentalId = req.params.id;
    const { message } = req.body;
    const rental = await rentalService.updateRentalIntoDB({
        rentalId: Number(rentalId),
        message,
        tenantId: Number(userId)
    });
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental updated successfully",
        data: rental
    });
})

const deleteRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const rentalId = req.params.id;
    const rental = await rentalService.deleteRentalFromDB(Number(rentalId), Number(userId));
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental deleted successfully",
        data: rental
    });
})

const updateRentalStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rentalId = req.params.id;
    const landlordId = req.user?.userId;
    const { status } = req.body;
    const rental = await rentalService.updateRentalStatusIntoDB({
        rentalId: Number(rentalId),
        status,
        landlordId: Number(landlordId)
    });
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental status updated successfully",
        data: rental
    });
})

export const rentalController = {
    getAllRentals,
    getRentalById,
    createRental,
    updateRental,
    deleteRental,
    updateRentalStatus
}
