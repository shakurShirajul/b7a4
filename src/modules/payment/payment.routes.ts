import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { paymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router: Router = Router();

router.post(
    "/create",
    auth("TENANT"),
    validateRequest(paymentValidation.createPaymentValidation),
    paymentController.createPayment
);

router.post(
    "/confirm",
    auth("TENANT", "ADMIN"),
    validateRequest(paymentValidation.confirmPaymentValidation),
    paymentController.confirmPayment
);

router.get("/", auth("TENANT", "ADMIN", "LANDLORD"), paymentController.getAllPayments);
router.get(
    "/:id",
    auth("TENANT", "ADMIN", "LANDLORD"),
    validateRequest(paymentValidation.idParamValidation),
    paymentController.getPaymentById
);

export const paymentRoutes: Router = router;
