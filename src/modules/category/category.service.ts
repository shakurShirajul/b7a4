import { prisma } from "../../lib/prisma"
import { ICategory } from "./category.interface"

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
    return categories
}

const createCategoryIntoDB = async (categoryData: Omit<ICategory, 'id' | 'slug'>) => {
    const { name, description } = categoryData;

    const categoryDescription = description ?? "";
    const slug = name.toLowerCase().replace(/\s+/g, '-');

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