import { Router } from "express";
import {
  registerPatient,
  getPatients,
  getPatientById,
  updatePatient,
} from "../controller/patientcontroller.js";

const router = Router();

// Patient routes
router.route("/register").post(registerPatient);
router.route("/:id").patch(updatePatient);

// Admin routes
router.route("/").get(getPatients);
router.route("/:id").get(getPatientById);

export default router;