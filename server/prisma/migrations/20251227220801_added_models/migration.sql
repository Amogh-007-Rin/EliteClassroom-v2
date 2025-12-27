-- AlterTable
ALTER TABLE "admin" ALTER COLUMN "contact" SET DATA TYPE BIGINT;

-- CreateTable
CREATE TABLE "student" (
    "studentId" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "contact" BIGINT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "mentor" (
    "mentorId" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "contact" BIGINT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentor_pkey" PRIMARY KEY ("mentorId")
);

-- CreateTable
CREATE TABLE "teacher" (
    "teacherId" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "contact" BIGINT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("teacherId")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_email_key" ON "student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_username_key" ON "student"("username");

-- CreateIndex
CREATE UNIQUE INDEX "student_contact_key" ON "student"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_email_key" ON "mentor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_username_key" ON "mentor"("username");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_contact_key" ON "mentor"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_email_key" ON "teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_username_key" ON "teacher"("username");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_contact_key" ON "teacher"("contact");
