import { prisma } from "../../lib/prisma";
import { ICreateRentalPayload, IUpdateRentalPayload, IUpdateRentalStatusPayload } from "./rental.interface"

type RentalFilter = {
    tenantId?: number;
    landLordId?: number;
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
    const { propertyId, tenantId, message } = rentalData;

    const propertyExist = await prisma.property.findUnique({
        where: {
            id: propertyId
        }
    });

    if (!propertyExist) {
        throw new Error("Property not found");
    }

    const rental = await prisma.rental.create({
        data: {
            landLordId: propertyExist.landlordId,
            propertyId,
            tenantId,
            message,
        }
    });
    return rental;
}

const updateRentalIntoDB = async (rentalData: IUpdateRentalPayload) => {
    const { rentalId, message, tenantId } = rentalData;

    const rental = await prisma.rental.update({
        where: {
            id: rentalId,
            tenantId
        },
        data: {
            message
        }
    });

    return rental;
}

const deleteRentalFromDB = async (rentalId: number, tenantId: number) => {
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

    const rental = await prisma.rental.update({
        where: {
            id: rentalId,
            landLordId: landlordId
        },
        data: {
            status
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
