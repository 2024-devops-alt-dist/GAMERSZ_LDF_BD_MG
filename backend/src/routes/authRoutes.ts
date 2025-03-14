import express from "express";
import { register, login } from "../controllers/auth"; // On importe les fonctions du contrôleur

const router = express.Router();

// Route d'inscription
router.post("/register", register);

// Route de connexion
router.post("/login", login);

export default router;
