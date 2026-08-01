import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { propertyRoutes } from "./modules/property/property.routes";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.routes";
import config from "./config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { categoryRoutes } from "./modules/category/category.routes";
import { rentalRoutes } from "./modules/rental/rental.routes";
import { reviewRoutes } from "./modules/review/review.routes";
import { paymentRoutes } from "./modules/payment/payment.routes";
import { paymentController } from "./modules/payment/payment.controller";
import { uploadRoutes } from "./modules/upload/upload.routes";


const app: Application = express();

const allowedOrigins = [
    config.app_url,
    config.client_url,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), paymentController.handleStripeWebhook);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "RentNest API is running",
    });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
        errorDetails: [
            {
                message: `${req.method} ${req.originalUrl} not found`,
            },
        ],
    });
});

app.use(globalErrorHandler);

export default app;
