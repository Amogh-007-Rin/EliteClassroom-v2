# EliteClassroom-v2

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?logo=Prisma&logoColor=white)](https://www.prisma.io/)

EliteClassroom-v2 is an open-source online tutoring platform that connects students with qualified tutors. Built with modern web technologies, it provides a seamless experience for booking sessions, managing profiles, and conducting virtual classes.

## Features

- **User Authentication**: Secure registration and login for students and tutors with JWT-based authentication using HttpOnly cookies.
- **Tutor Marketplace**: Browse and search tutors by subjects, view detailed profiles with ratings and reviews.
- **Booking System**: Schedule sessions with built-in overlap protection to prevent double-bookings.
- **Role-Based Dashboards**: Separate views for students (upcoming/past sessions) and tutors (appointments and payment status).
- **Video Rooms**: Placeholder for virtual classrooms (expandable for real-time video integration).
- **Responsive Design**: Mobile-friendly UI built with TailwindCSS.
- **API-Driven**: RESTful APIs with validation using Zod and data management via Prisma ORM.

## Tech Stack

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Argon2 for password hashing
- **Validation**: Zod for schema validation
- **Middleware**: CORS, Helmet, Cookie-Parser

### Frontend
- **Framework**: React with TypeScript and Vite
- **Styling**: TailwindCSS with PostCSS
- **State Management**: TanStack Query for server state
- **HTTP Client**: Axios with cookie support
- **Form Handling**: React Hook Form with Zod validation

### DevOps & Tools
- **Linting**: ESLint
- **Build Tools**: Vite for frontend, TypeScript compiler for backend
- **Database Migrations**: Prisma Migrate
- **Seeding**: Prisma Seed script

## Project Structure

```
EliteClassroom-v2/
├── execution.md                 # Project requirements and specifications
├── package.json                 # Root package.json (if any workspace setup)
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
│       ├── components/          # Reusable UI components (e.g., Navbar.tsx)
│       ├── hooks/               # Custom React hooks
│       ├── lib/                 # Utilities (api.ts, utils.ts)
│       └── pages/               # Page components (Dashboard, Home, Login, etc.)
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
│       ├── types.d.ts           # Type definitions
│       ├── lib/                 # Utilities (prisma.ts)
│       ├── middleware/          # Express middleware (auth.ts, validate.ts)
│       └── routes/              # API routes (auth.ts, bookings.ts, tutors.ts)
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

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Tutors
- `GET /api/tutors` - List tutors (optional `?subject=` filter)

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/me` - Get user's bookings (role-based)

For detailed API documentation, refer to the route files in `server/src/routes/`.

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
02. Student Email  : amoghdath.kalasapura.arunkumar@mail.bcu.ac.uk

Happy coding! 🚀