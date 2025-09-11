"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // ton frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json()); // parse le JSON du body
// --- Inscription ---
app.post("/auth/register", async (req, res) => {
    console.log("Body reçu :", req.body);
    const { email, mot_de_passe } = req.body;
    if (!email || !mot_de_passe) {
        return res.status(400).json({ error: "Email et mot de passe requis" });
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(mot_de_passe, 10);
        const user = await prisma.user.create({
            data: { email, mot_de_passe: hashedPassword },
        });
        res.json({ message: "Compte créé avec succès ✅", user });
    }
    catch (error) {
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
        const isPasswordValid = await bcryptjs_1.default.compare(mot_de_passe, user.mot_de_passe);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect ❌" });
        }
        // Générer un token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, "SECRET_KEY", // ⚠️ à remplacer par une vraie clé dans ton .env
        { expiresIn: "1h" });
        res.json({ message: "Connexion réussie ✅", token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
app.listen(4000, () => console.log("🚀 Backend démarré sur http://localhost:4000"));
//# sourceMappingURL=server.js.map