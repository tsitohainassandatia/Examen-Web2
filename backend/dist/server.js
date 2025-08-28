import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET || "secret";
// --- Inscription ---
app.post("/auth/register", async (req, res) => {
    const { email, mot_de_pass } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(mot_de_pass, 10);
        const user = await prisma.user.create({
            data: { email, mot_de_passe: hashedPassword }, // nom est optionnel
        });
        res.json({ message: "Utilisateur créé ✅", user });
    }
    catch (error) {
        res.status(400).json({ error: "Email déjà utilisé" });
    }
});
// --- Connexion ---
app.post("/auth/login", async (req, res) => {
    const { email, mot_de_pass } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: "Utilisateur non trouvé" });
    const isPasswordValid = await bcrypt.compare(mot_de_pass, user.mot_de_passe);
    if (!isPasswordValid)
        return res.status(401).json({ error: "Mot de passe incorrect" });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Connexion réussie ✅", token });
});
// --- Exemple de route protégée ---
app.get("/auth/profile", async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(403).json({ error: "Token manquant" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, createdAt: true },
        });
        res.json(user);
    }
    catch {
        res.status(403).json({ error: "Token invalide" });
    }
});
app.listen(4000, () => console.log("🚀 Backend démarré sur http://localhost:4000"));
//# sourceMappingURL=server.js.map