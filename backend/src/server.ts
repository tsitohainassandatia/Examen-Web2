import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: "http://localhost:5173", // ton frontend
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());   // parse le JSON du body

// --- Inscription ---
app.post("/auth/register", async (req, res) => {
  console.log("Body reçu :", req.body);
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const user = await prisma.user.create({
      data: { email, mot_de_passe: hashedPassword },
    });
    res.json({ message: "Compte créé avec succès ✅", user });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Email déjà utilisé ou erreur serveur" });
  }
});

// --- Connexion ---
app.post("/auth/login", async (req, res) => {
  console.log("Body reçu :", req.body);
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect ❌" });
    }

    const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect ❌" });
    }

    // Générer un token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "SECRET_KEY", // ⚠️ à remplacer par une vraie clé dans ton .env
      { expiresIn: "1h" }
    );

    res.json({ message: "Connexion réussie ✅", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(4000, () => console.log("🚀 Backend démarré sur http://localhost:4000"));
