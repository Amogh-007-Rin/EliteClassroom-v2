# EliteClassroom-v2

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?logo=Prisma&logoColor=white)](https://www.prisma.io/)

EliteClassroom-v2 is an open-source online tutoring platform that connects students with qualified tutors. Built with modern web technologies, it provides a seamless experience for booking sessions, managing profiles, and conducting virtual classes.

## Features

- **User Authentication**: Secure registration, login, and logout for students and tutors with JWT-based authentication using HttpOnly cookies.
- **Tutor Marketplace**: 
  - Advanced filtering by subject, hourly rate, and verification status.
  - Detailed tutor profiles with availability, bio, and subjects.
  - **Reviews & Ratings**: Students can leave verified reviews for tutors they have booked.
- **Booking System**: 
  - Schedule sessions with built-in overlap protection.
  - **Status Management**: Tutors can accept or decline pending booking requests.
  - **Notifications**: Real-time updates on booking status (Pending, Confirmed, Cancelled).
- **Role-Based Dashboards**: 
  - **Student**: View upcoming/past sessions, leave reviews.
  - **Tutor**: Manage appointments, update profile settings (Bio, Rates, Subjects), view earnings.
- **Video Rooms**: Integration ready for Jitsi Meet/WebRTC for virtual classrooms.
- **Responsive Design**: Mobile-friendly UI built with TailwindCSS and Shadcn UI components.
- **API-Driven**: RESTful APIs with Zod validation, Prisma ORM, and comprehensive integration tests.

## Tech Stack

### Backend
- **Framework**: Express.js (v5) with TypeScript
- **Database**: PostgreSQL with Prisma ORM (using `@prisma/adapter-pg` for serverless compatibility)
- **Authentication**: JWT with Argon2 for password hashing
- **Validation**: Zod for schema validation
- **Testing**: Jest with Supertest
- **Middleware**: CORS, Helmet, Cookie-Parser

### Frontend
- **Framework**: React with TypeScript and Vite
- **Styling**: TailwindCSS with PostCSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios with cookie support
- **Form Handling**: React Hook Form
- **UI Components**: Reusable components (Modals, Forms)

### DevOps & Tools
- **Linting**: ESLint
- **Build Tools**: Vite for frontend, TypeScript compiler for backend
- **Database Migrations**: Prisma Migrate
- **Seeding**: Prisma Seed script

## Project Structure

```
EliteClassroom-v2/
├── execution.md                 # Project requirements and specifications
├── package.json                 # Root package.json
├── project-stage.txt            # Current project status and notes
├── client/                      # Frontend application
│   ├── eslint.config.js         # ESLint configuration
│   ├── index.html               # Main HTML entry point
│   ├── package.json             # Frontend dependencies
│   ├── postcss.config.js        # PostCSS configuration
│   ├── tailwind.config.js       # TailwindCSS configuration
│   ├── tsconfig*.json           # TypeScript configurations
│   ├── vite.config.ts           # Vite build configuration
│   ├── public/                  # Static assets
│   └── src/                     # Source code
│       ├── App.css              # App-specific styles
│       ├── App.tsx              # Main App component with routing
│       ├── index.css            # Global styles
│       ├── main.tsx             # React entry point
│       ├── assets/              # Images, icons, etc.
│       ├── components/          # Reusable UI components
│       │   ├── Navbar.tsx       # Navigation bar with auth state
│       │   └── ReviewModal.tsx  # Modal for submitting reviews
│       ├── lib/                 # Utilities (api.ts, utils.ts)
│       └── pages/               # Page components
│           ├── Dashboard.tsx    # User dashboard (Student/Tutor)
│           ├── Home.tsx         # Landing page
│           ├── Login.tsx        # Login page
│           ├── Register.tsx     # Registration page
│           ├── Room.tsx         # Video classroom page
│           ├── TutorProfile.tsx # Public tutor profile view
│           └── Tutors.tsx       # Tutor marketplace with filters
├── server/                      # Backend application
│   ├── .env                     # Environment variables (not committed)
│   ├── .env.example             # Environment template
│   ├── package.json             # Backend dependencies
│   ├── prisma.config.ts         # Prisma configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── prisma/                  # Database schema and migrations
│   │   ├── schema.prisma        # Prisma schema definition
│   │   ├── seed.ts              # Database seeding script
│   │   └── migrations/          # Migration files
│   └── src/                     # Source code
│       ├── app.ts               # Express app setup
│       ├── index.ts             # Server entry point
│       ├── jest.config.js       # Jest testing configuration
│       ├── types.d.ts           # Type definitions
│       ├── lib/                 # Utilities (prisma.ts)
│       ├── middleware/          # Express middleware (auth.ts, validate.ts)
│       ├── routes/              # API routes
│       │   ├── auth.ts          # Auth routes (Login, Register, Me, Logout)
│       │   ├── bookings.ts      # Booking management
│       │   ├── reviews.ts       # Review system
│       │   └── tutors.ts        # Tutor profile and search
│       └── tests/               # Integration tests
│           └── server.test.ts   # API integration tests
└── README.md                    # This file
```

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (>= 18.0.0) - [Download here](https://nodejs.org/)
- **PostgreSQL** - Local installation or a hosted instance (e.g., Supabase, Railway, Neon.tech)
- **Git** - For cloning the repository

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Amogh-007-Rin/EliteClassroom-v2.git
   cd EliteClassroom-v2
   ```

2. **Set up the backend**:
   ```bash
   cd server
   npm install
   ```

3. **Set up the frontend**:
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**:
   - Copy `server/.env.example` to `server/.env`
   - Update the `DATABASE_URL` to point to your PostgreSQL instance
   - Add other required variables (e.g., JWT secrets if needed)

5. **Set up the database**:
   ```bash
   cd server
   npm run prisma:generate  # Generate Prisma client
   npm run prisma:migrate   # Run migrations
   npm run prisma:seed      # Seed the database with sample data
   ```

## Running the Project

1. **Start the backend server**:
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

2. **Start the frontend client** (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`.

3. **Access the application**:
   - Open your browser and navigate to `http://localhost:5173`
   - Register as a student or tutor
   - Explore the marketplace, book sessions, and view dashboards

## Running Tests

To run the integration tests for the backend:

```bash
cd server
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Tutors
- `GET /api/tutors` - List tutors (supports filters: `?subject=`, `?minRate=`, `?maxRate=`, `?verified=`)
- `GET /api/tutors/:id` - Get specific tutor details
- `PUT /api/tutors/profile` - Update tutor profile (Auth required)

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/me` - Get user's bookings (role-based)
- `PATCH /api/bookings/:id` - Update booking status (e.g., Accept/Decline)

### Reviews
- `POST /api/reviews` - Submit a review for a tutor (Student only, requires completed booking)

For detailed API documentation, refer to the route files in `server/src/routes/` and tests in `server/src/tests/`.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and TypeScript conventions
- Write tests for new features
- Update documentation as needed
- Ensure all commits are signed if required

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Amogh Dath K A** - *Developed-by* - [Your GitHub](https://github.com/Amogh-007-Rin)

## Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries
- Inspired by the need for accessible online education platforms

## Support

If you have any questions or need help, please open an issue on GitHub or reach out to the maintainers.

---
I Will be active on this following platforms :-
01. Personal Email : amoghdath233@gmail.com
02. Student Email  : amoghdath.kalasapuraarunkumar@mail.bcu.ac.uk

Happy coding! 🚀
