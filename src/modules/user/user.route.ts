import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router: Router = Router()

router.post("/register", userController.registerUser);
router.patch("/update", auth(), userController.updateUser);
router.patch("/me", auth(), userController.updateUser);

export const userRoutes: Router = router;
