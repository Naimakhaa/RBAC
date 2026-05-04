import { Router } from "express";
import { showLogin, login } from "../controllers/authController";

const router = Router();

router.get("/login", showLogin);
router.post("/login", login);

export default router;