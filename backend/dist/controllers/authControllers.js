"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --------------------
// Inscription
// --------------------
const registerUser = async (req, res) => {
    try {
        // 1️⃣ Récupération des données envoyées par le front
        const { email, mot_de_pass, nom } = req.body;
        if (!email || !mot_de_pass || !nom) {
            return res.status(400).json({ message: "email, nom et mot_de_pass sont requis" });
        }
        // 2️⃣ Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email déjà utilisé ❌" });
        }
        // 3️⃣ Hachage du mot de passe
        const hashedPassword = await bcryptjs_1.default.hash(mot_de_pass, 10);
        // 4️⃣ Création de l’utilisateur
        const user = await prisma.user.create({
            data: {
                email: email,
                nom: nom,
                mot_de_passe: hashedPassword, // ⚠️ respecte bien le nom de ta colonne
            },
            select: {
                id: true,
                email: true,
                nom: true,
                createdAt: true,
            },
        });
        return res.status(201).json({
            message: "Utilisateur créé ✅",
            user,
        });
    }
    catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        return res.status(500).json({
            message: "Erreur serveur ❌",
            error: error.message,
        });
    }
};
exports.registerUser = registerUser;
//# sourceMappingURL=authControllers.js.map