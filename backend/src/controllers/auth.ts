import { Request, Response } from "express";

/**
 * Contrôleur pour l'inscription des utilisateurs
 */
export const register = async (req: Request, res: Response) => {
    try {
        // Récupération des données du corps de la requête
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }

        // Logique d'enregistrement (ex: sauvegarde en base de données)
        // Ici, on renvoie juste un message de succès pour l'exemple
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Contrôleur pour la connexion des utilisateurs
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }

        // Logique de connexion (ex: vérification en base de données)
        res.json({ message: "User logged in successfully!" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
