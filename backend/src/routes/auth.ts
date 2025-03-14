import { Router } from "express";
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { findUserByEmail, createUser } from "../models/userModel";

const router = express.Router();

// 🚀 Inscription
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "Email déjà utilisé" });
  }

  const newUser = await createUser(email, password);

  res.status(201).json({ message: "Utilisateur créé avec succès", userId: newUser._id });
});

// 🚀 Connexion
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
  
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }
  
    const token = generateToken(user._id!.toString());
  
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
  
    res.json({ message: "Connexion réussie" });
  });
  
