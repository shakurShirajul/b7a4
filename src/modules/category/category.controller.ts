import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { categoryService } from "./category.service";


const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoryService.getAllCategoriesFromDB();
    return sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Categories fetched successfully",
        data: categories
    })
})

const getCategoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;
    const category = await categoryService.getCategoryByIdFromDB(Number(categoryId));
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category fetched successfully",
        data: category
    })
})

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const category = await categoryService.createCategoryIntoDB(payload);
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: category
    })
})

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;
    const payload = req.body;
    const category = await categoryService.updateCategoryIntoDB({id: Number(categoryId), ...payload});
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category updated successfully",
        data: category
    })
})

const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;
    const deletedCategory = await categoryService.deleteCategoryFromDB(Number(categoryId));
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category deleted successfully",
        data: deletedCategory
    })
})

export const categoryController = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}
