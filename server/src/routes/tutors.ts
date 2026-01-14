import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { validate } from '../middleware/validate';

export const tutorsRouter = Router();

const querySchema = z.object({
  query: z.object({
    subject: z.string().optional(),
  }),
});

tutorsRouter.get('/', validate(querySchema), async (req, res) => {
  const subject = req.query.subject as string | undefined;
  const tutors = await prisma.tutorProfile.findMany({
    where: subject
      ? {
          subjects: {
            some: { subject: { name: { contains: subject, mode: 'insensitive' } } },
          },
        }
      : undefined,
    include: {
      user: true,
      subjects: { include: { subject: true } },
    },
  });
  res.json(
    tutors.map((t) => ({
      id: t.id,
      userId: t.userId,
      bio: t.bio,
      hourlyRate: t.hourlyRate,
      verified: t.verified,
      firstName: (t as any).user.firstName,
      lastName: (t as any).user.lastName,
      subjects: t.subjects.map((s) => s.subject.name),
    }))
  );
});
