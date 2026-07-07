import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router: Router = Router()

router.get("/", auth("ADMIN"), userController.getAllUsers);
router.get("/me", auth(), userController.getUserById);
router.get("/:id", auth("ADMIN"), validateRequest(userValidation.idParamValidation), userController.getUserById);
router.post("/register", validateRequest(userValidation.registerUserValidation), userController.registerUser);
router.patch("/update", auth(), validateRequest(userValidation.updateUserValidation), userController.updateUser);
router.patch("/me", auth(), validateRequest(userValidation.updateUserValidation), userController.updateUser);
router.patch("/status/:id", auth("ADMIN"), validateRequest(userValidation.updateUserStatusValidation), userController.udpateUserStatus);

export const userRoutes: Router = router;
