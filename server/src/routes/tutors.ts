import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const subject = typeof req.query.subject === "string" ? req.query.subject : undefined;
  const tutors = await prisma.tutorProfile.findMany({
    where: subject
      ? {
          subjects: {
            some: {
              subject: {
                name: { contains: subject, mode: "insensitive" },
              },
            },
          },
        }
      : undefined,
    select: {
      id: true,
      bio: true,
      hourlyRate: true,
      verified: true,
      subjects: { select: { subject: { select: { name: true } } } },
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });
  return res.json(
    (tutors as any[]).map((t) => ({
      id: t.id,
      bio: t.bio,
      hourlyRate: t.hourlyRate,
      verified: t.verified,
      subjects: t.subjects.map((s: any) => s.subject.name),
      user: {
        id: t.user.id,
        firstName: t.user.firstName,
        lastName: t.user.lastName,
        email: t.user.email,
      },
    }))
  );
});

export default router;
