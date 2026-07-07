import { prisma } from "../../lib/prisma"
import { IProperty } from "./property.interface";

const getAllPropertiesFromDB = async () => {
    const properties = await prisma.property.findMany({});
    return properties;
}

const getPropertiesByIdFromDB = async (propertyId: number) => {
    const property = await prisma.property.findUnique({
        where: {
            id: propertyId
        }
    })
    return property;
}

const createPropertyIntoDB = async (propertyData: IProperty) => {
    const { landlordId, title, description, address, city, state, country, postalCode, price, isAvailable, status, categoryId, amenities } = propertyData;

    const landLordExist = await prisma.user.findUnique({
        where: {
            id: landlordId,
            role: "LANDLORD",
            status: "ACTIVE"
        }
    })

    if (!landLordExist) {
        throw new Error("Landlord does not exist");
    }

    const categoryExist = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })

    if (!categoryExist) {
        throw new Error("Category does not exist");
    }

    const createProperty = await prisma.property.create({
        data: {
            landlordId,
            title,
            description,
            address,
            city,
            state,
            country,
            postalCode,
            price,
            isAvailable,
            status,
            categoryId,
            amenities
        }
    })

    return createProperty;

}

const updatePropertyIntoDB = async (propertyData: IProperty) => {
    const { id, landlordId, title, description, address, city, state, country, postalCode, price, isAvailable, status, categoryId, amenities } = propertyData;

    const propertyExist = await prisma.property.findUnique({
        where: {
            id,
            landlordId
        }
    })

    if (!propertyExist) {
        throw new Error("Property does not exist");
    }

    const categoryExist = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })

    if (!categoryExist) {
        throw new Error("Category does not exist");
    }

    const updateProperty = await prisma.property.update({
        where: {
            id,
            landlordId
        },
        data: {
            title,
            description,
            address,
            city,
            state,
            country,
            postalCode,
            price,
            isAvailable,
            status,
            categoryId,
            amenities
        }
    })

    return updateProperty;
}

const deletePropertyFromDB = (propertyId: number, landlordId: number) => {
    const deleteProperty = prisma.property.findUnique({
        where: {
            id: propertyId,
            landlordId
        }
    })

    if (!deleteProperty) {
        throw new Error("Property does not exist");
    }

    const deletePropertyFromDB = prisma.property.delete({
        where: {
            id: propertyId,
            landlordId
        }
    })

    return deletePropertyFromDB;
}

export const propertyService = {
    getAllPropertiesFromDB,
    getPropertiesByIdFromDB,
    createPropertyIntoDB,
    updatePropertyIntoDB,
    deletePropertyFromDB
}