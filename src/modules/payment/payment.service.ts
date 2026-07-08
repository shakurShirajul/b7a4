import Stripe from "stripe";
import { randomUUID } from "crypto";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ICreatePaymentPayload, IPaymentFilter } from "./payment.interface";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const getStripeClient = () => {
    if (!config.stripe_secret_key) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Stripe secret key is not configured");
    }

    return new Stripe(config.stripe_secret_key);
};

const createPaymentIntoDB = async (payload: ICreatePaymentPayload) => {
    const { rentalId, payerId } = payload;

    const stripe = getStripeClient();

    const rental = await prisma.rental.findFirst({
        where: {
            id: rentalId,
            tenantId: payerId,
        },
        include: {
            property: true,
        },
    });

    if (!rental) {
        throw new AppError(httpStatus.NOT_FOUND, "Rental not found");
    }

    if (rental.status !== "APPROVED") {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment is only allowed for approved rentals");
    }

    const existingPayment = await prisma.payment.findFirst({
        where: {
            rentalId,
            payerId,
            status: {
                in: ["PENDING", "COMPLETED"],
            },
        },
    });

    if (existingPayment) {
        throw new AppError(httpStatus.CONFLICT, "Payment already exists for this rental");
    }

    const amount = Number(rental.property.price);
    const transactionId = `rentnest_${randomUUID()}`;

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.client_url}/payment/cancel`,
        customer_email: undefined,
        metadata: {
            rentalId: String(rental.id),
            payerId: String(payerId),
            transactionId,
        },
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: `Rent payment for ${rental.property.title}`,
                        description: rental.property.address,
                    },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            },
        ],
    });

    const payment = await prisma.payment.create({
        data: {
            rentalId,
            payerId,
            transactionId,
            amount,
            currency: "bdt",
            status: "PENDING",
            provider: "STRIPE",
            stripeCheckoutSessionId: session.id,
        },
    });

    return {
        payment,
        checkoutUrl: session.url,
        sessionId: session.id,
    };
};

const confirmStripePaymentIntoDB = async (sessionId: string) => {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const payment = await prisma.payment.findUnique({
        where: {
            stripeCheckoutSessionId: session.id,
        },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    const paymentIntentId = typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    const status = session.payment_status === "paid" ? "COMPLETED" : "FAILED";

    const [updatedPayment] = await prisma.$transaction([
        prisma.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                status,
                stripePaymentIntentId: paymentIntentId,
                paidAt: status === "COMPLETED" ? new Date() : null,
            },
        }),
        ...(status === "COMPLETED"
            ? [
                prisma.rental.update({
                    where: {
                        id: payment.rentalId,
                    },
                    data: {
                        status: "ACTIVE",
                    },
                }),
            ]
            : []),
    ]);

    return updatedPayment;
};

const getAllPaymentsFromDB = async (filter?: IPaymentFilter) => {
    const { landlordId, ...paymentFilter } = filter || {};
    const payments = await prisma.payment.findMany({
        where: {
            ...paymentFilter,
            ...(landlordId ? { rental: { landlordId } } : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            rental: {
                include: {
                    property: true,
                },
            },
        },
    });

    return payments;
};

const getPaymentByIdFromDB = async (paymentId: number, filter?: IPaymentFilter) => {
    const { landlordId, ...paymentFilter } = filter || {};
    const payment = await prisma.payment.findFirst({
        where: {
            id: paymentId,
            ...paymentFilter,
            ...(landlordId ? { rental: { landlordId } } : {}),
        },
        include: {
            rental: {
                include: {
                    property: true,
                },
            },
        },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    return payment;
};

const handleStripeWebhook = async (payload: Buffer, signature?: string) => {
    const stripe = getStripeClient();

    if (!config.stripe_webhook_secret) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Stripe webhook secret is not configured");
    }

    if (!signature) {
        throw new AppError(httpStatus.BAD_REQUEST, "Stripe signature is required");
    }

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe_webhook_secret
    );

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        await confirmStripePaymentIntoDB(session.id);
    }

    if (event.type === "checkout.session.expired") {
        const session = event.data.object;

        await prisma.payment.updateMany({
            where: {
                stripeCheckoutSessionId: session.id,
                status: "PENDING",
            },
            data: {
                status: "CANCELLED",
            },
        });
    }
};

export const paymentService = {
    createPaymentIntoDB,
    confirmStripePaymentIntoDB,
    handleStripeWebhook,
    getAllPaymentsFromDB,
    getPaymentByIdFromDB,
};
