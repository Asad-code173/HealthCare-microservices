import { Router } from "express";
import {
    createDoctor,
    getAllDoctors,
    getAllDoctorsAdmin,
    getDoctorById,
    updateDoctor,
    deleteDoctor
} from "../controller/doctorcontroller.js";

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────
router.route("/").get(getAllDoctors);


// ─── Admin Routes ─────────────────────────────────────────────────────────────
router.route("/").post(createDoctor);
router.route("/admin").get(getAllDoctorsAdmin);
router.route("/:id").patch(updateDoctor);
router.route("/:id").delete(deleteDoctor);

export default router;