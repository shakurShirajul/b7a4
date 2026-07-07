import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { propertyValidation } from "./property.validation";

const router: Router = Router();

router.get("", propertyController.getAllProperties);
router.get("/:id", validateRequest(propertyValidation.idParamValidation), propertyController.getPropertyById);
router.post("/", auth("LANDLORD"), validateRequest(propertyValidation.createPropertyValidation), propertyController.createProperty);
router.patch("/:id", auth("LANDLORD"), validateRequest(propertyValidation.updatePropertyValidation), propertyController.updateProperty);
router.delete("/:id", auth("LANDLORD"), validateRequest(propertyValidation.idParamValidation), propertyController.deleteProperty);


export const propertyRoutes: Router = router;
