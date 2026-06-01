import { Router } from "express";
import {
  registerPatient,
  getPatients,
  getPatientById,

} from "../controller/patientcontroller.js";
import { verifyToken,isAdmin } from "../../Middleware/verifyToken.js";

const router = Router();

// Patient routes
router.route("/register-patient").post(registerPatient);

// Admin routes
router.route("/get-patients").get(verifyToken,isAdmin,getPatients);
router.route("/get-patients/:id").get(verifyToken,isAdmin,getPatientById);

export default router;