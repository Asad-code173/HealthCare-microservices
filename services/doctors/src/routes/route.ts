import { Router } from "express";
import { verifyToken,isAdmin } from "../../Middleware/verifyToken.js";
import {
    createDoctor,
    getAllDoctors,
    getAllDoctorsAdmin,

    updateDoctor,
    deleteDoctor,
    getUploadUrl
} from "../controller/doctorcontroller.js";

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────
router.route("/get-doctors").get(getAllDoctors);


// ─── Admin Routes ─────────────────────────────────────────────────────────────
router.route("/create-doctors").post(verifyToken,isAdmin,createDoctor);
router.route("/getdoctors").get(verifyToken,isAdmin,getAllDoctorsAdmin);
router.route("/update-doctor/:id").put(verifyToken,isAdmin,updateDoctor);
router.route("/delete-doctor/:id").delete(verifyToken,isAdmin,deleteDoctor);
router.route("/upload-url").post(verifyToken,isAdmin,getUploadUrl)

export default router;