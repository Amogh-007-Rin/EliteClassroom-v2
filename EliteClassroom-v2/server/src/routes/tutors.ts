import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { auth } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const updateProfileSchema = z.object({
  bio: z.string().optional(),
  hourlyRate: z.union([z.number(), z.string()]).transform((val) => Number(val)),
  verified: z.boolean().optional(),
  subjects: z.array(z.string()).optional(),
});

router.get("/", async (req: Request, res: Response) => {
  const subject = typeof req.query.subject === "string" ? req.query.subject : undefined;
  const verified = req.query.verified === 'true';
  const minRate = req.query.minRate ? Number(req.query.minRate) : undefined;
  const maxRate = req.query.maxRate ? Number(req.query.maxRate) : undefined;

  const where: any = {};
  
  if (subject) {
    where.subjects = {
      some: {
        subject: {
          name: { contains: subject, mode: "insensitive" },
        },
      },
    };
  }

  if (verified) {
    where.verified = true;
  }

  if (minRate !== undefined || maxRate !== undefined) {
    where.hourlyRate = {};
    if (minRate !== undefined) where.hourlyRate.gte = minRate;
    if (maxRate !== undefined) where.hourlyRate.lte = maxRate;
  }

  const tutors = await prisma.tutorProfile.findMany({
    where,
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

router.get("/profile", auth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (user.role !== "TUTOR") {
      return res.status(403).json({ error: "Only tutors can access their profile" });
    }

    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: user.id },
      include: {
        subjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    return res.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/profile", auth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (user.role !== "TUTOR") {
      return res.status(403).json({ error: "Only tutors can update their profile" });
    }

    const result = updateProfileSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const { bio, hourlyRate, verified, subjects } = result.data;

    // First ensure profile exists or update it
    const profile = await prisma.tutorProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        bio,
        hourlyRate: hourlyRate,
        verified: verified || false,
      },
      update: {
        bio,
        hourlyRate,
        verified,
      },
    });

    if (subjects) {
      // Find or create subjects
      const subjectIds: number[] = [];
      for (const name of subjects) {
        // Simple case insensitive normalization could be added here, but sticking to exact match for now
        const sub = await prisma.subject.upsert({
          where: { name },
          create: { name },
          update: {},
        });
        subjectIds.push(sub.id);
      }

      // Update relations using a transaction
      await prisma.$transaction(async (tx) => {
        // Remove all existing subjects for this tutor
        await tx.tutorSubject.deleteMany({
          where: { tutorId: profile.id },
        });
        
        // Add new ones
        if (subjectIds.length > 0) {
          // Use createMany if supported (Postgres supports it)
          await tx.tutorSubject.createMany({
            data: subjectIds.map((sid) => ({
              tutorId: profile.id,
              subjectId: sid,
            })),
            skipDuplicates: true,
          });
        }
      });
    }

    return res.json({ success: true, profile });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  
  try {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id },
      include: {
        user: { 
          select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            email: true,
            createdAt: true
          } 
        },
        subjects: { 
          include: { 
            subject: true 
          } 
        },
        reviews: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }
    
    return res.json(tutor);
  } catch (error) {
    console.error("Get tutor error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
