import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authRequired } from '../middleware/auth';
import { prisma } from '../lib/prisma';

export const bookingsRouter = Router();

const createSchema = z.object({
  body: z.object({
    tutorId: z.number(),
    startTime: z.string(),
    endTime: z.string(),
  }),
});

bookingsRouter.post('/', authRequired, validate(createSchema), async (req, res) => {
  const studentId = (req as any).user.id as number;
  const { tutorId, startTime, endTime } = req.body;
  const start = new Date(startTime);
  const end = new Date(endTime);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const overlap = await tx.booking.findFirst({
        where: {
          tutorId,
          status: { not: 'CANCELLED' },
          OR: [
            { startTime: { lt: end }, endTime: { gt: start } },
          ],
        } as any
      });
      if (overlap) throw new Error('Time slot overlaps an existing booking');

      const booking = await tx.booking.create({
        data: { studentId, tutorId, startTime: start, endTime: end, status: 'PENDING' },
      });
      return booking;
    });

    res.json({ booking: result });
  } catch (e: any) {
    return res.status(400).json({ error: e.message ?? 'Failed to create booking' });
  }
});

bookingsRouter.get('/me', authRequired, async (req, res) => {
  const user = (req as any).user as { id: number; role: string };
  if (user.role === 'STUDENT') {
    const bookings = await prisma.booking.findMany({
      where: { studentId: user.id },
      include: { tutor: true },
      orderBy: { startTime: 'asc' },
    });
    return res.json({ bookings });
  } else {
    const bookings = await prisma.booking.findMany({
      where: { tutorId: user.id },
      include: { student: true },
      orderBy: { startTime: 'asc' },
    });
    return res.json({ bookings });
  }
});
