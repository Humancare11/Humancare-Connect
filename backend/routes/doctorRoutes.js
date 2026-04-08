import express from "express";
import { 
  registerDoctor, 
  loginDoctor, 
  getEnrollment, 
  submitEnrollment 
} from "../controllers/doctorController.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/enrollment/:doctorId", getEnrollment);
router.post("/enrollment", submitEnrollment);

export default router;
