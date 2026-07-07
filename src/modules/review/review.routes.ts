import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";

const router: Router = Router();

router.post("/", auth("TENANT"), reviewController.createReview)

export const reviewRoutes = router;