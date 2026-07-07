import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const properties = await propertyService.getAllPropertiesFromDB();
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties fetched successfully",
        data: properties
    })
})

const getPropertyById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;
    const property = await propertyService.getPropertiesByIdFromDB(Number(propertyId));
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property fetched successfully",
        data: property
    })
})

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.userId;
    const property = await propertyService.createPropertyIntoDB({ ...req.body, landlordId });
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Property created successfully",
        data: property
    })
})

const updateProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;
    const landlordId = req.user?.userId;
    const payload = req.body;
    const property = await propertyService.updatePropertyIntoDB({ id: Number(propertyId), ...payload, landlordId: Number(landlordId) });
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property updated successfully",
        data: property
    })
})

const deleteProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.userId;
    const propertyId = req.params.id;
    const deletedProperty = await propertyService.deletePropertyFromDB(Number(propertyId), Number(landlordId));
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property deleted successfully",
        data: deletedProperty
    })
})

export const propertyController = {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
}