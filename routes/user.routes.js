import express from "express";
import { registerController, rootController } from "../Controller/user.controller.js";

const router = express.Router();

router.get('/',rootController);
router.get('/register',registerController);

export default router;