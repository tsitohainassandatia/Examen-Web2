import { Router } from "express";
import { registerUser } from "../controllers/authControllers";

const router = Router();

// Route inscription
router.post("/register", registerUser);

export default router;
