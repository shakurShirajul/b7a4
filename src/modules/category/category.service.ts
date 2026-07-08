import { prisma } from "../../lib/prisma"
import { ICategory } from "./category.interface"
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const getAllCategoriesFromDB = async () => {
    const categories = await prisma.category.findMany({})
    return categories
}

const getCategoryByIdFromDB = async (categoryId: number) => {
    const categories = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })

    if (!categories) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    return categories
}

const createCategoryIntoDB = async (categoryData: Omit<ICategory, 'id' | 'slug'>) => {
    const { name, description } = categoryData;

    const categoryDescription = description ?? "";
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const existingCategory = await prisma.category.findFirst({
        where: {
            OR: [
                { name },
                { slug },
            ],
        },
    });

    if (existingCategory) {
        throw new AppError(httpStatus.CONFLICT, "Category already exists");
    }

    const newCategory = await prisma.category.create({
        data: {
            name,
            description: categoryDescription,
            slug
        }
    })

    return newCategory
}

const udpateCategoryIntoDB = async (categoryData: Omit<ICategory, 'slug'>) => {
    const { id, name, description } = categoryData;

    const categoryDescription = description ?? "";
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = await prisma.category.findUnique({
        where: {
            id
        }
    });

    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    const updatedCategory = await prisma.category.update({
        where: {
            id
        },
        data: {
            name,
            description: categoryDescription,
            slug
        }
    })
    return updatedCategory
}

const deleteCategoryFromDB = async (categoryId: number) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    });

    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }

    const deletedCategory = await prisma.category.delete({
        where: {
            id: categoryId
        }
    })
    return deletedCategory;
}

export const categoryService = {
    getAllCategoriesFromDB,
    getCategoryByIdFromDB,
    createCategoryIntoDB,
    udpateCategoryIntoDB,
    deleteCategoryFromDB
}
