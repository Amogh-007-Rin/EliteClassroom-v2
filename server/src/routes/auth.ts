import { Router, Request, Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { prisma } from "../lib/prisma";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "TUTOR"]).default("STUDENT"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

router.post("/register", validate(registerSchema), async (req: Request, res: Response) => {
  const { email, password, role, firstName, lastName } = req.body as z.infer<typeof registerSchema>;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: "Email already in use" });
  }
  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, role, firstName, lastName },
  });
  const secret = process.env.JWT_SECRET ?? "dev-secret";
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, secret, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  return res.json({ id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const secret = process.env.JWT_SECRET ?? "dev-secret";
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, secret, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  return res.json({ id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName });
});

router.get("/me", async (req: Request, res: Response) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const secret = process.env.JWT_SECRET ?? "dev-secret";
    const payload = jwt.verify(token, secret) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;

