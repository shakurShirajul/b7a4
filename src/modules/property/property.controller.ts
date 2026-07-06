import { Request, Response } from "express";

const getAllProperties = async (req: Request, res: Response) => {

}

const getPropertyById = async (req: Request, res: Response) => {
    return res.status(200).json({ message: "Property fetched successfully" });
}

const createProperty =  async (req: Request, res: Response) => {
    return res.status(201).json({ message: "Property created successfully" });
}

export const propertyController = {
    getAllProperties,
    getPropertyById,
    createProperty
}