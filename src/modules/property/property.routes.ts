import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middlewares/auth";

const router: Router = Router();

router.get("", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.post("/", auth("LANDLORD"), propertyController.createProperty);
router.patch("/:id", auth("LANDLORD"), propertyController.updateProperty);
router.delete("/:id", auth("LANDLORD"), propertyController.deleteProperty);


export const propertyRoutes: Router = router;
