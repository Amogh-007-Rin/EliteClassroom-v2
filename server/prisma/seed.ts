import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import argon2 from "argon2";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function run() {
  const subjects = ["Math", "Physics", "Chemistry", "Computer Science"];
  for (const name of subjects) {
    await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const passwordHash = await argon2.hash("password123");

  const tutor1 = await prisma.user.upsert({
    where: { email: "tutor1@example.com" },
    update: {},
    create: {
      email: "tutor1@example.com",
      passwordHash,
      firstName: "Alice",
      lastName: "Tutor",
      role: UserRole.TUTOR,
    },
  });
  const tutor2 = await prisma.user.upsert({
    where: { email: "tutor2@example.com" },
    update: {},
    create: {
      email: "tutor2@example.com",
      passwordHash,
      firstName: "Bob",
      lastName: "Tutor",
      role: UserRole.TUTOR,
    },
  });
  const student1 = await prisma.user.upsert({
    where: { email: "student1@example.com" },
    update: {},
    create: {
      email: "student1@example.com",
      passwordHash,
      firstName: "Charlie",
      lastName: "Student",
      role: UserRole.STUDENT,
    },
  });
  const student2 = await prisma.user.upsert({
    where: { email: "student2@example.com" },
    update: {},
    create: {
      email: "student2@example.com",
      passwordHash,
      firstName: "Dana",
      lastName: "Student",
      role: UserRole.STUDENT,
    },
  });

  const profile1 = await prisma.tutorProfile.upsert({
    where: { userId: tutor1.id },
    update: {},
    create: {
      userId: tutor1.id,
      bio: "Experienced Math and Physics tutor.",
      hourlyRate: "40.00",
      verified: true,
    },
  });
  const profile2 = await prisma.tutorProfile.upsert({
    where: { userId: tutor2.id },
    update: {},
    create: {
      userId: tutor2.id,
      bio: "Chemistry and CS enthusiast.",
      hourlyRate: "35.00",
      verified: false,
    },
  });

  const math = await prisma.subject.findUnique({ where: { name: "Math" } });
  const physics = await prisma.subject.findUnique({ where: { name: "Physics" } });
  const chemistry = await prisma.subject.findUnique({ where: { name: "Chemistry" } });
  const cs = await prisma.subject.findUnique({ where: { name: "Computer Science" } });

  if (math && physics) {
    await prisma.tutorSubject.upsert({
      where: { tutorId_subjectId: { tutorId: profile1.id, subjectId: math.id } },
      update: {},
      create: { tutorId: profile1.id, subjectId: math.id },
    });
    await prisma.tutorSubject.upsert({
      where: { tutorId_subjectId: { tutorId: profile1.id, subjectId: physics.id } },
      update: {},
      create: { tutorId: profile1.id, subjectId: physics.id },
    });
  }

  if (chemistry && cs) {
    await prisma.tutorSubject.upsert({
      where: { tutorId_subjectId: { tutorId: profile2.id, subjectId: chemistry.id } },
      update: {},
      create: { tutorId: profile2.id, subjectId: chemistry.id },
    });
    await prisma.tutorSubject.upsert({
      where: { tutorId_subjectId: { tutorId: profile2.id, subjectId: cs.id } },
      update: {},
      create: { tutorId: profile2.id, subjectId: cs.id },
    });
  }

  console.log("Seed complete:", { tutor1: tutor1.email, tutor2: tutor2.email, student1: student1.email, student2: student2.email });
}

run().finally(async () => {
  await prisma.$disconnect();
});
