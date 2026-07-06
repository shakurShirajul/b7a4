import { Router } from "express";
import { propertyController } from "./property.controller";

const router: Router = Router();

router.get("/properties", propertyController.getAllProperties);
router.get("/properties/:id", propertyController.getPropertyById);
router.post("/landlord/properties", propertyController.createProperty);


export const propertyRoutes: Router = router;