import express from "express";
import { registerController, rootController, verifyController } from "../Controller/user.controller.js";

const router = express.Router();

router.get('/',rootController);
router.post('/register',registerController);
router.get('/verify/:token',verifyController);


export default router;