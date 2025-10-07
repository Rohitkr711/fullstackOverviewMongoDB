import express from "express";
import { loginController, registerController, rootController, verifyController } from "../Controller/user.controller.js";

const router = express.Router();

router.get('/',rootController);
router.post('/register',registerController);
router.get('/verify/:token',verifyController);
router.post('/login',loginController);



export default router;