import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

const bookingSchema = z.object({
  tutorId: z.coerce.number().int(),
  startTime: z.string(),
  endTime: z.string(),
});

router.post("/", auth, validate(bookingSchema), async (req: Request, res: Response) => {
  const { tutorId, startTime, endTime } = req.body as z.infer<typeof bookingSchema>;
  const studentId = (req as any).user?.id as number | undefined;
  if (!studentId) return res.status(401).json({ error: "Unauthorized" });
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (!(start instanceof Date) || isNaN(start.getTime()) || !(end instanceof Date) || isNaN(end.getTime()) || start >= end) {
    return res.status(400).json({ error: "Invalid time range" });
  }
  const result = await prisma.$transaction(async (tx) => {
    const overlap = await tx.booking.findFirst({
      where: {
        tutorId,
        status: { not: "CANCELLED" },
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });
    if (overlap) {
      throw new Error("Time slot not available");
    }
    const booking = await tx.booking.create({
      data: {
        studentId,
        tutorId,
        startTime: start,
        endTime: end,
      },
    });
    return booking;
  });
  return res.json(result);
});

export default router;
router.get("/me", auth, async (req: Request, res: Response) => {
  const userId = (req as any).user?.id as number | undefined;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [{ studentId: userId }, { tutorId: userId }],
    },
    orderBy: { startTime: "asc" },
  });
  return res.json(bookings);
});
