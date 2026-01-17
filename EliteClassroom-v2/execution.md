EXECUTION.md
1. Project Context
Project Name: EliteClassroom Description: A full-stack tutoring marketplace and virtual classroom platform. Goal: Build a functional MVP for a university submission that allows users to register (Student/Tutor), search for tutors, book sessions, and view their dashboard.

2. Tech Stack Rules
Frontend: React (Vite), TypeScript, TailwindCSS, Shadcn/UI (components), React Router v6, TanStack Query (React Query).

Backend: Node.js, Express.js, TypeScript.

Database: PostgreSQL, Prisma ORM.

Validation: Zod (shared schemas preferred).

Auth: JWT (HttpOnly cookies), Argon2 (hashing).

Styling: Mobile-first, responsive.

3. Directory Structure
The project should be structured as follows:

Plaintext

/elite-classroom
  /server         # Backend (Express + Prisma)
  /client         # Frontend (React + Vite)
  README.md
4. Phase 1: Backend Implementation
Step 1.1: Database Schema (Prisma)
Initialize Prisma in /server and use the following schema.prisma exactly. This models the Users, Profiles, and Bookings.

Code snippet

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  STUDENT
  TUTOR
  ADMIN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String
  firstName     String
  lastName      String
  role          UserRole  @default(STUDENT)
  createdAt     DateTime  @default(now())

  // Relations
  profile       TutorProfile?
  studentBookings Booking[] @relation("StudentBookings")
  tutorBookings   Booking[] @relation("TutorBookings")
  sentMessages    Message[] @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
}

model TutorProfile {
  id          Int      @id @default(autoincrement())
  userId      Int      @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  bio         String?
  hourlyRate  Decimal  @db.Decimal(10, 2)
  verified    Boolean  @default(false)
  
  subjects    TutorSubject[]
  availabilities Availability[]
}

model Subject {
  id      Int            @id @default(autoincrement())
  name    String         @unique
  tutors  TutorSubject[]
}

model TutorSubject {
  tutorId   Int
  subjectId Int
  tutor     TutorProfile @relation(fields: [tutorId], references: [id])
  subject   Subject      @relation(fields: [subjectId], references: [id])

  @@id([tutorId, subjectId])
}

model Booking {
  id          Int           @id @default(autoincrement())
  studentId   Int
  tutorId     Int
  student     User          @relation("StudentBookings", fields: [studentId], references: [id])
  tutor       User          @relation("TutorBookings", fields: [tutorId], references: [id])
  startTime   DateTime
  endTime     DateTime
  status      BookingStatus @default(PENDING)
  createdAt   DateTime      @default(now())
}

model Availability {
  id          Int          @id @default(autoincrement())
  tutorId     Int
  profile     TutorProfile @relation(fields: [tutorId], references: [id])
  startTime   DateTime
  endTime     DateTime
  isBooked    Boolean      @default(false)
}

model Message {
  id          Int      @id @default(autoincrement())
  senderId    Int
  receiverId  Int
  sender      User     @relation("SentMessages", fields: [senderId], references: [id])
  receiver    User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
  content     String
  sentAt      DateTime @default(now())
}
Step 1.2: Backend Setup & Middleware
Initialize Express app with cors, helmet, cookie-parser, and dotenv.

Zod Middleware: Create src/middleware/validate.ts to validate request bodies against Zod schemas.

Auth Middleware: Create src/middleware/auth.ts to verify JWT tokens from req.cookies.

Step 1.3: Auth Routes (/api/auth)
Implement the following endpoints:

POST /register: Accepts { email, password, role, firstName, lastName }. Hashes password with Argon2. Returns JWT.

POST /login: Verifies password. Sets httpOnly cookie.

GET /me: Returns the current authenticated user.

Step 1.4: Tutor & Booking Routes
GET /api/tutors: Returns list of tutors with their profiles and subjects. Support query params ?subject=Math.

POST /api/bookings: Accepts { tutorId, startTime, endTime }.

CRITICAL: Use prisma.$transaction to check for overlap (Booking where status is NOT Cancelled) before creating.

5. Phase 2: Frontend Implementation
Step 2.1: Setup & UI Library
Initialize Vite (React + TS).

Install TailwindCSS.

Initialize Shadcn/UI (npx shadcn-ui@latest init).

Install core components: Button, Input, Card, Dialog (Modal), Select, Avatar.

Step 2.2: Global State & API
Setup TanStack Query (React Query) provider in main.tsx.

Create an axios instance with withCredentials: true to handle cookies automatically.

Step 2.3: Auth Pages
/login: Simple form using react-hook-form and zod.

/register: Form to select Role (Student/Tutor) and enter details.

Step 2.4: Core Features
Landing Page (Home):

Hero section with "Find Tutors" search bar.

"Featured Tutors" grid fetching from GET /api/tutors.

Tutor Profile Page:

Show Bio, Hourly Rate, and Subjects.

Booking UI: Simple date/time picker. On submit, call POST /api/bookings.

Dashboard (/dashboard):

Student View: List of "Upcoming Sessions" and "Past Sessions".

Tutor View: List of "Upcoming Appointments" and "Payment Status".

6. Implementation Order (Prompting Strategy)
Instructions for the AI: Execute these tasks sequentially.

"Scaffold the Server": Create the server folder, install dependencies (express, prisma, zod, etc.), and set up the app.ts entry point.

"Database Init": Create the schema.prisma, run the migration, and seed the database with 2 Tutors and 2 Students for testing.

"Auth API": Build the Auth Controller and Routes. verify with curl or Postman.

"Scaffold the Client": Create the client folder, setup Tailwind and Shadcn.

"Frontend Auth": Build the Login/Register pages and connect them to the Auth API.

"Marketplace Flow": Build the Tutor List API and the Frontend Grid to display them.

"Booking Flow": Implement the transaction logic on the backend and the Booking Form on the frontend.

"Dashboard": Create the protected route to show the user's bookings.

7. MVP Constraints (Do Not Overengineer)
No Stripe Integration: For this MVP, assume all payments are successful or mock the payment step.

No Live Video: For the "Classroom" link, simply generate a dummy link (e.g., /room/123) that leads to a placeholder page saying "Video Room".

Simple Search: Filter by exact string match or simple "contains" for subjects.

8. Definition of Done
The project is ready for submission when:

I can run npm run dev in both client and server.

I can Register as a Student.

I can Register as a Tutor.

The Student can login, see the Tutor in the list, and click "Book".

The booking appears on both the Student's and Tutor's dashboard.