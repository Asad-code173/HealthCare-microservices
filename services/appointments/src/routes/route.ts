import { Router } from "express";
import { createBooking,fetchBookings,
    cancelBooking,confirmBooking } from "../controller/appointmentcontroller.js";
import { verifyToken,isAdmin } from "../../Middleware/verifyToken.js";


const router= Router()
router.route("/create-booking").post(verifyToken,createBooking)
router.route("/get-booking").get(verifyToken,fetchBookings)
router.route("/confirm-booking/:appointmentId").patch(verifyToken,isAdmin,confirmBooking);
router.route("/cancel-booking/:appointmentId").patch(verifyToken,isAdmin,cancelBooking);




export default router