"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validate_1 = require("../middleware/validate");
const prisma_1 = require("../lib/prisma");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(["STUDENT", "TUTOR"]).default("STUDENT"),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
});
router.post("/register", (0, validate_1.validate)(registerSchema), async (req, res) => {
    const { email, password, role, firstName, lastName } = req.body;
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing) {
        return res.status(400).json({ error: "Email already in use" });
    }
    const passwordHash = await argon2_1.default.hash(password);
    const user = await prisma_1.prisma.user.create({
        data: { email, passwordHash, role, firstName, lastName },
    });
    const secret = process.env.JWT_SECRET ?? "dev-secret";
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email }, secret, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    return res.json({ id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName });
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
router.post("/login", (0, validate_1.validate)(loginSchema), async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const ok = await argon2_1.default.verify(user.passwordHash, password);
    if (!ok) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const secret = process.env.JWT_SECRET ?? "dev-secret";
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email }, secret, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    return res.json({ id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, message: "Login successful" });
});
router.get("/me", async (req, res) => {
    const token = req.cookies?.token;
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const secret = process.env.JWT_SECRET ?? "dev-secret";
        const payload = jsonwebtoken_1.default.verify(token, secret);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.id } });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        return res.json({ id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName });
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
});
exports.default = router;
