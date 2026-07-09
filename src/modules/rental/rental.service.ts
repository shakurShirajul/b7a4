import { prisma } from "../../lib/prisma";
import { ICreateRentalPayload, IUpdateRentalPayload, IUpdateRentalStatusPayload } from "./rental.interface"
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

type RentalFilter = {
    tenantId?: number;
    landlordId?: number;
}

const getAllRentalsFromDB = async (filter?: RentalFilter) => {
    const rentals = await prisma.rental.findMany({
        where: filter,
    });
    return rentals;
}

const getRentalByIdFromDB = async (rentalId: number, filter?: RentalFilter) => {
    const rental = await prisma.rental.findFirst({
        where: {
            id: rentalId,
            ...filter,
        },
    });
    return rental;
}

const createRentalIntoDB = async (rentalData: ICreateRentalPayload) => {
    const { propertyId, tenantId, message, moveInDate, startDate, endDate } = rentalData;

    const propertyExist = await prisma.property.findUnique({
        where: {
            id: propertyId
        }
    });

    if (!propertyExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }

    if (propertyExist.landlordId === tenantId) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot request your own property");
    }

    if (!propertyExist.isAvailable || propertyExist.status !== "ACTIVE") {
        throw new AppError(httpStatus.BAD_REQUEST, "Property is not available for rent");
    }

    const existingRental = await prisma.rental.findFirst({
        where: {
            propertyId,
            tenantId,
            status: {
                in: ["PENDING", "APPROVED", "ACTIVE"],
            },
        },
    });

    if (existingRental) {
        throw new AppError(httpStatus.CONFLICT, "You already have an active rental request for this property");
    }

    const rental = await prisma.rental.create({
        data: {
            landlordId: propertyExist.landlordId,
            propertyId,
            tenantId,
            message,
            moveInDate,
            startDate,
            endDate,
        }
    });
    return rental;
}

const updateRentalIntoDB = async (rentalData: IUpdateRentalPayload) => {
    const { rentalId, message, tenantId, moveInDate, startDate, endDate } = rentalData;

    const existingRental = await prisma.rental.findFirst({
        where: {
            id: rentalId,
            tenantId,
        },
    });

    if (!existingRental) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental not found");
    }

    if (existingRental.status !== "PENDING") {
        throw new AppError(httpStatus.BAD_REQUEST, "Only pending rental requests can be updated");
    }

    const rental = await prisma.rental.update({
        where: {
            id: rentalId,
            tenantId
        },
        data: {
            message,
            moveInDate,
            startDate,
            endDate,
        }
    });

    return rental;
}

const deleteRentalFromDB = async (rentalId: number, tenantId: number) => {
    const existingRental = await prisma.rental.findFirst({
        where: {
            id: rentalId,
            tenantId,
        },
    });

    if (!existingRental) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental not found");
    }

    if (existingRental.status !== "PENDING") {
        throw new AppError(httpStatus.BAD_REQUEST, "Only pending rental requests can be deleted");
    }

    const rental = await prisma.rental.delete({
        where: {
            id: rentalId,
            tenantId
        }
    });
    return rental;
}

const updateRentalStatusIntoDB = async (rentalData: IUpdateRentalStatusPayload) => {
    const { rentalId, status, landlordId } = rentalData;

    const existingRental = await prisma.rental.findFirst({
        where: {
            id: rentalId,
            landlordId,
        },
    });

    if (!existingRental) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental not found");
    }

    if (existingRental.status === "REJECTED" || existingRental.status === "CANCELLED" || existingRental.status === "COMPLETED") {
        throw new AppError(httpStatus.BAD_REQUEST, `Rental is already ${existingRental.status.toLowerCase()}`);
    }

    if (existingRental.status === "PENDING" && !["APPROVED", "REJECTED", "CANCELLED"].includes(status)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Pending rentals can only be approved, rejected, or cancelled");
    }

    if (existingRental.status === "APPROVED" && status !== "CANCELLED") {
        throw new AppError(httpStatus.BAD_REQUEST, "Approved rentals become active only after completed payment");
    }

    if (existingRental.status === "ACTIVE" && !["COMPLETED", "CANCELLED"].includes(status)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Active rentals can only be completed or cancelled");
    }

    const rental = await prisma.rental.update({
        where: {
            id: rentalId,
            landlordId
        },
        data: {
            status,
            approvedAt: status === "APPROVED" ? new Date() : undefined,
            rejectedAt: status === "REJECTED" ? new Date() : undefined,
        }
    });
    return rental;
}

export const rentalService = {
    getAllRentalsFromDB,
    getRentalByIdFromDB,
    createRentalIntoDB,
    updateRentalIntoDB,
    deleteRentalFromDB,
    updateRentalStatusIntoDB
}
