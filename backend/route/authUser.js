import express from "express"
import { UserRegister } from "../routeController/Userroutecontroller.js";
import { UserLogin } from "../routeController/Userroutecontroller.js";
import { UserLogout } from "../routeController/Userroutecontroller.js";

const router=express.Router();

router.post("/register",UserRegister);
router.post("/login",UserLogin);
router.post("/logout",UserLogout);


export default router;