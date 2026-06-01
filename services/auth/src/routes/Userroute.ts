import { Router } from "express";
import {
    registerUser,
    loginUser, logoutUser,
    changeCurrentPassword,refreshAccessToken,getAdminDashboard,
    userprofile
} from "../controller/usercontroller.js";
import { verifyJWT,isAdmin } from "../../Middleware/Authmiddleware.js";

const router = Router();
router.route("/register").post(registerUser)

router.route("/login").post(loginUser)
// secured routes
router.route("/logout").post(verifyJWT, logoutUser)


router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").patch(verifyJWT,changeCurrentPassword)
// // admin
router.route("/admin/dashboard").get(verifyJWT,isAdmin,getAdminDashboard)

router.route("/me").get(verifyJWT,userprofile)



export default router
