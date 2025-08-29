import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const app = express();
const prisma = new PrismaClient();

app.use(cors());           // permet à ton frontend de communiquer

app.use(cors({
  origin: "http://localhost:5173", // ton frontend
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());
   // parse le JSON du body
// --- Inscription ---
app.post("/auth/register", async (req, res) => {
  console.log("Body reçu :", req.body);
  const { email, mot_de_pass } = req.body;

  if (!email || !mot_de_pass) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const hashedPassword = await bcrypt.hash(mot_de_pass, 10);
    const user = await prisma.user.create({
      data: { email, mot_de_passe: hashedPassword }, // "nom" est optionnel
    });
    res.json({ message: "Compte créé avec succès ✅", user });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: "Email déjà utilisé ou erreur serveur" });
  }
});

app.listen(4000, () => console.log("🚀 Backend démarré sur http://localhost:4000"));
