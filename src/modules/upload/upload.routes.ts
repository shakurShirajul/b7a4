import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { uploadController } from "./upload.controller";
import { uploadSingleImage } from "./upload.middleware";

const router: Router = Router();

router.post(
    "/image",
    auth("LANDLORD", "ADMIN"),
    uploadSingleImage,
    uploadController.uploadImage
);

export const uploadRoutes: Router = router;
