import { prisma } from "../../lib/prisma";
import { IRental } from "./rental.interface"

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

const getRentalByIdFromDB = async (rentalId: number) => {

}

const createRentalIntoDB = async (rentalData: IRental) => {

}

const updateRentalIntoDB = async (rentalId: number, rentalData: Partial<IRental >) => {

}

const deleteRentalFromDB = async (rentalId: number) => {

}

export const rentalService = {
    getAllRentalsFromDB,
    getRentalByIdFromDB,
    createRentalIntoDB,
    updateRentalIntoDB,
    deleteRentalFromDB
}
