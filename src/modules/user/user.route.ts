import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router: Router = Router()

router.get("/", auth("ADMIN"), userController.getAllUsers);
router.get("/:id", auth("ADMIN"), userController.getUserById);
router.get("/me", auth(), userController.getUserById);
router.post("/register", userController.registerUser);
router.patch("/update", auth(), userController.updateUser);
router.patch("/me", auth(), userController.updateUser);
router.patch("/status/:id", auth("ADMIN"), userController.udpateUserStatus);

export const userRoutes: Router = router;
