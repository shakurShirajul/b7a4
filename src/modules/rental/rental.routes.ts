import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middlewares/auth";

const router : Router = Router();

router.get("/",auth("TENANT", "ADMIN", "LANDLORD"), rentalController.getAllRentals);
export const rentalRoutes: Router = router;