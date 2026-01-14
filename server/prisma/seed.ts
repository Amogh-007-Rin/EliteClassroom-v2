import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const subjects = ['Math', 'Physics', 'Chemistry', 'Biology'];
  for (const name of subjects) {
    await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const student1 = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      email: 'student1@example.com',
      passwordHash: await argon2.hash('password123'),
      firstName: 'Student',
      lastName: 'One',
      role: 'STUDENT',
    },
  });
  const student2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      email: 'student2@example.com',
      passwordHash: await argon2.hash('password123'),
      firstName: 'Student',
      lastName: 'Two',
      role: 'STUDENT',
    },
  });

  const tutor1 = await prisma.user.upsert({
    where: { email: 'tutor1@example.com' },
    update: {},
    create: {
      email: 'tutor1@example.com',
      passwordHash: await argon2.hash('password123'),
      firstName: 'Tutor',
      lastName: 'One',
      role: 'TUTOR',
    },
  });
  const tutor2 = await prisma.user.upsert({
    where: { email: 'tutor2@example.com' },
    update: {},
    create: {
      email: 'tutor2@example.com',
      passwordHash: await argon2.hash('password123'),
      firstName: 'Tutor',
      lastName: 'Two',
      role: 'TUTOR',
    },
  });

  const tutorProfile1 = await prisma.tutorProfile.upsert({
    where: { userId: tutor1.id },
    update: {},
    create: { userId: tutor1.id, bio: 'Experienced Math tutor', hourlyRate: '40.00', verified: true },
  });
  const tutorProfile2 = await prisma.tutorProfile.upsert({
    where: { userId: tutor2.id },
    update: {},
    create: { userId: tutor2.id, bio: 'Physics enthusiast', hourlyRate: '45.00', verified: true },
  });

  const math = await prisma.subject.findUnique({ where: { name: 'Math' } });
  const physics = await prisma.subject.findUnique({ where: { name: 'Physics' } });
  if (math) {
    await prisma.tutorSubject.upsert({
      where: { tutorId_subjectId: { tutorId: tutorProfile1.id, subjectId: math.id } },
      update: {},
      create: { tutorId: tutorProfile1.id, subjectId: math.id },
    });
  }
  if (physics) {
    await prisma.tutorSubject.upsert({
      where: { tutorId_subjectId: { tutorId: tutorProfile2.id, subjectId: physics.id } },
      update: {},
      create: { tutorId: tutorProfile2.id, subjectId: physics.id },
    });
  }
}

main().finally(() => prisma.$disconnect());
