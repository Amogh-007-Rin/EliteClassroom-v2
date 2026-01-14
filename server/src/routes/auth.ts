import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { prisma } from '../lib/prisma';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { authRequired } from '../middleware/auth';

export const authRouter = Router();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['STUDENT', 'TUTOR']),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
});

authRouter.post('/register', validate(registerSchema), async (req, res) => {
  const { email, password, role, firstName, lastName } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email already registered' });
  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, role, firstName, lastName },
  });
  if (role === 'TUTOR') {
    await prisma.tutorProfile.create({
      data: { userId: user.id, bio: '', hourlyRate: '50.00', verified: false },
    });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ user });
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

authRouter.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ user });
});

authRouter.get('/me', authRequired, async (req, res) => {
  const userId = (req as any).user.id as number;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  res.json({ user });
});
