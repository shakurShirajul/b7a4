import httpStatus from "http-status";
import { Prisma } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma"
import { IProperty, IPropertyQuery } from "./property.interface";

const getAllPropertiesFromDB = async (query: IPropertyQuery = {}) => {
    const {
        searchTerm,
        city,
        country,
        categoryId,
        minPrice,
        maxPrice,
        amenities,
        status = "ACTIVE",
        isAvailable = true,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.PropertyWhereInput = {
        status,
        isAvailable,
        ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
        ...(country ? { country: { contains: country, mode: "insensitive" } } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(amenities ? { amenities: { contains: amenities, mode: "insensitive" } } : {}),
        ...((minPrice !== undefined || maxPrice !== undefined)
            ? {
                price: {
                    ...(minPrice !== undefined ? { gte: minPrice } : {}),
                    ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
                },
            }
            : {}),
        ...(searchTerm
            ? {
                OR: [
                    { title: { contains: searchTerm, mode: "insensitive" } },
                    { description: { contains: searchTerm, mode: "insensitive" } },
                    { address: { contains: searchTerm, mode: "insensitive" } },
                    { city: { contains: searchTerm, mode: "insensitive" } },
                    { country: { contains: searchTerm, mode: "insensitive" } },
                    { amenities: { contains: searchTerm, mode: "insensitive" } },
                ],
            }
            : {}),
    };

    const [properties, total] = await prisma.$transaction([
        prisma.property.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                category: true,
                landlord: {
                    omit: {
                        password: true,
                        refreshTokenHash: true,
                    },
                },
            },
        }),
        prisma.property.count({ where }),
    ]);

    return {
        data: properties,
        meta: {
            page,
            limit,
            total,
        },
    };
}

const getPropertiesByIdFromDB = async (propertyId: number) => {
    const property = await prisma.property.findUnique({
        where: {
            id: propertyId
        },
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true,
                    refreshTokenHash: true,
                },
            },
            reviews: true
        }
    })

    if (!property) {
        throw new AppError(httpStatus.NOT_FOUND, "Property not found");
    }

    return property;
}

const createPropertyIntoDB = async (propertyData: IProperty) => {
    const { landlordId, title, description, address, city, state, country, postalCode, price, images, latitude, longitude, isAvailable, status, categoryId, amenities } = propertyData;

    const landLordExist = await prisma.user.findUnique({
        where: {
            id: landlordId,
            role: "LANDLORD",
            status: "ACTIVE"
        }
    })

    if (!landLordExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Landlord does not exist");
    }

    const categoryExist = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })

    if (!categoryExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Category does not exist");
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
            images,
            latitude,
            longitude,
            isAvailable,
            status,
            categoryId,
            amenities
        }
    })

    return createProperty;

}

const updatePropertyIntoDB = async (propertyData: IProperty) => {
    const { id, landlordId, title, description, address, city, state, country, postalCode, price, images, latitude, longitude, isAvailable, status, categoryId, amenities } = propertyData;

    const propertyExist = await prisma.property.findUnique({
        where: {
            id,
            landlordId
        }
    })

    if (!propertyExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Property does not exist");
    }

    if (categoryId) {
        const categoryExist = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })

        if (!categoryExist) {
            throw new AppError(httpStatus.NOT_FOUND, "Category does not exist");
        }
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
            images,
            latitude,
            longitude,
            isAvailable,
            status,
            categoryId,
            amenities
        }
    })

    return updateProperty;
}

const deletePropertyFromDB = async (propertyId: number, landlordId: number) => {
    const property = await prisma.property.findFirst({
        where: {
            id: propertyId,
            landlordId
        },
        include: {
            _count: {
                select: {
                    rentals: true,
                    reviews: true
                }
            }
        }
    })

    if (!property) {
        throw new AppError(httpStatus.NOT_FOUND, "Property does not exist");
    }

    if (property._count.rentals > 0 || property._count.reviews > 0) {
        throw new AppError(
            httpStatus.CONFLICT,
            "Property cannot be deleted because it has related rental history, payments, or reviews"
        );
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
