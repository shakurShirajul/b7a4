import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";

const router: Router = Router();

router.post("/login", validateRequest(authValidation.loginUserValidation), authController.loginUser);
router.post("/refresh-token", validateRequest(authValidation.refreshTokenValidation), authController.refreshToken);
router.post("/logout", validateRequest(authValidation.refreshTokenValidation), authController.logoutUser);

export const authRoutes: Router = router;
