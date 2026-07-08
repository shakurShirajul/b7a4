import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewValidation } from "./review.validation";

const router: Router = Router();

router.get("/", auth("ADMIN"), reviewController.getAllReviews);
router.get("/me", auth("TENANT"), reviewController.getMyReviews);
router.get("/property/:propertyId", validateRequest(reviewValidation.propertyIdParamValidation), reviewController.getPropertyReviews);
router.post("/", auth("TENANT"), validateRequest(reviewValidation.createReviewValidation), reviewController.createReview)

export const reviewRoutes = router;
