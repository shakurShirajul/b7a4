import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";

const router:Router = Router();

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", auth("ADMIN"), categoryController.createCategory);
router.patch("/:id", auth("ADMIN"), categoryController.updateCategory);
router.delete("/:id", auth("ADMIN"), categoryController.deleteCategory);

export const categoryRoutes = router;