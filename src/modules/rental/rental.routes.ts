import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { rentalValidation } from "./rental.validation";

const router : Router = Router();

router.get("/",auth("TENANT", "ADMIN", "LANDLORD"), rentalController.getAllRentals);
router.get("/:id", auth("TENANT", "ADMIN", "LANDLORD"), validateRequest(rentalValidation.idParamValidation), rentalController.getRentalById);
router.post("/", auth("TENANT"), validateRequest(rentalValidation.createRentalValidation), rentalController.createRental);
router.patch("/:id", auth("TENANT"), validateRequest(rentalValidation.updateRentalValidation), rentalController.updateRental);
router.delete("/:id", auth("TENANT"), validateRequest(rentalValidation.idParamValidation), rentalController.deleteRental);
router.patch("/:id/status", auth("LANDLORD"), validateRequest(rentalValidation.updateRentalStatusValidation), rentalController.updateRentalStatus);
export const rentalRoutes: Router = router;
