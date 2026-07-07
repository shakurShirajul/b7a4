import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";

const router : Router = Router();

router.get("/",auth("TENANT", "ADMIN", "LANDLORD"), rentalController.getAllRentals);
router.get("/:id", auth("TENANT", "ADMIN", "LANDLORD"), rentalController.getRentalById);
router.post("/", auth("TENANT"), rentalController.createRental);
router.patch("/:id", auth("TENANT"), rentalController.updateRental);
router.delete("/:id", auth("TENANT"), rentalController.deleteRental);
router.patch("/:id/status", auth("LANDLORD"), rentalController.updateRentalStatus);
export const rentalRoutes: Router = router;
