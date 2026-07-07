import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";

const router:Router = Router();

router.get("/", categoryController.getAllCategories);
router.get("/:id", validateRequest(categoryValidation.idParamValidation), categoryController.getCategoryById);
router.post("/", auth("ADMIN"), validateRequest(categoryValidation.createCategoryValidation), categoryController.createCategory);
router.patch("/:id", auth("ADMIN"), validateRequest(categoryValidation.updateCategoryValidation), categoryController.updateCategory);
router.delete("/:id", auth("ADMIN"), validateRequest(categoryValidation.idParamValidation), categoryController.deleteCategory);

export const categoryRoutes = router;
