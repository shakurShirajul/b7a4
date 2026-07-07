import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewValidation } from "./review.validation";

const router: Router = Router();

router.post("/", auth("TENANT"), validateRequest(reviewValidation.createReviewValidation), reviewController.createReview)

export const reviewRoutes = router;
