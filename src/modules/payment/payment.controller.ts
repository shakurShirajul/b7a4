import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const { rentalId } = req.body;

    const result = await paymentService.createPaymentIntoDB({
        rentalId: Number(rentalId),
        payerId: Number(userId),
    });

    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Stripe checkout session created successfully",
        data: result,
    });
});

const confirmPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId } = req.body;
    const payment = await paymentService.confirmStripePaymentIntoDB(sessionId);

    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment confirmed successfully",
        data: payment,
    });
});

const getAllPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const userId = req.user?.userId;

    let payments;

    if (userRole === "ADMIN") {
        payments = await paymentService.getAllPaymentsFromDB();
    } else if (userRole === "LANDLORD") {
        payments = await paymentService.getAllPaymentsFromDB({ landLordId: Number(userId) });
    } else {
        payments = await paymentService.getAllPaymentsFromDB({ payerId: Number(userId) });
    }

    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payments fetched successfully",
        data: payments,
    });
});

const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const userId = req.user?.userId;
    const paymentId = Number(req.params.id);

    let payment;

    if (userRole === "ADMIN") {
        payment = await paymentService.getPaymentByIdFromDB(paymentId);
    } else if (userRole === "LANDLORD") {
        payment = await paymentService.getPaymentByIdFromDB(paymentId, { landLordId: Number(userId) });
    } else {
        payment = await paymentService.getPaymentByIdFromDB(paymentId, { payerId: Number(userId) });
    }

    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment fetched successfully",
        data: payment,
    });
});

const handleStripeWebhook = async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    await paymentService.handleStripeWebhook(
        req.body,
        Array.isArray(signature) ? signature[0] : signature
    );

    res.json({
        received: true,
    });
};

export const paymentController = {
    createPayment,
    confirmPayment,
    getAllPayments,
    getPaymentById,
    handleStripeWebhook,
};
