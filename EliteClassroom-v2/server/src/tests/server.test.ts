import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../lib/prisma', () => {
  const mockPrisma: any = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    tutorProfile: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    subject: {
      upsert: jest.fn(),
    },
    tutorSubject: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    booking: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    review: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  mockPrisma.$transaction = jest.fn((callback: any) => callback(mockPrisma));
  return { prisma: mockPrisma };
});

jest.mock('argon2');
jest.mock('jsonwebtoken');

describe('API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth Routes', () => {
    it('should register a new user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed_password');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: 'STUDENT',
        firstName: 'John',
        lastName: 'Doe',
      });
      (jwt.sign as jest.Mock).mockReturnValue('mock_token');

      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should login an existing user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        role: 'STUDENT',
      });
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock_token');

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
    });

    it('should fail login with wrong password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        role: 'STUDENT',
      });
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should get current user (me)', async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: 'STUDENT',
        firstName: 'John',
        lastName: 'Doe',
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', ['token=mock_token']);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('Tutor Routes', () => {
    it('should get all tutors', async () => {
      (prisma.tutorProfile.findMany as jest.Mock).mockResolvedValue([
        {
          id: 1,
          bio: 'Math Tutor',
          hourlyRate: 50,
          verified: true,
          subjects: [{ subject: { name: 'Math' } }],
          user: { id: 1, firstName: 'Tutor', lastName: 'One', email: 'tutor@test.com' },
        },
      ]);

      const res = await request(app).get('/api/tutors');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });

    it('should get a tutor by id', async () => {
      (prisma.tutorProfile.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        user: { id: 1, firstName: 'Tutor', lastName: 'One' },
        subjects: [],
        reviews: [],
      });

      const res = await request(app).get('/api/tutors/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
    });

    it('should update tutor profile', async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ id: 1, role: 'TUTOR' });
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, role: 'TUTOR' });
        
        (prisma.tutorProfile.upsert as jest.Mock).mockResolvedValue({
            id: 1,
            userId: 1,
            bio: 'Updated Bio',
            hourlyRate: 60,
            verified: false
        });

        (prisma.subject.upsert as jest.Mock).mockResolvedValue({
            id: 10,
            name: 'Math'
        });

        const res = await request(app)
            .put('/api/tutors/profile')
            .set('Cookie', ['token=mock_token'])
            .send({
                bio: 'Updated Bio',
                hourlyRate: 60,
                subjects: ['Math']
            });
            
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('profile');
        expect(res.body.profile).toHaveProperty('bio', 'Updated Bio');
    });
  });

  describe('Booking Routes', () => {
    it('should create a booking', async () => {
      // Mock auth
      (jwt.verify as jest.Mock).mockReturnValue({ id: 2, role: 'STUDENT' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 2, role: 'STUDENT' });
      
      (prisma.booking.findFirst as jest.Mock).mockResolvedValue(null); // No overlap
      (prisma.booking.create as jest.Mock).mockResolvedValue({
        id: 100,
        studentId: 2,
        tutorId: 1,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        status: 'PENDING',
      });

      const res = await request(app)
        .post('/api/bookings')
        .set('Cookie', ['token=mock_token'])
        .send({
          tutorId: 1,
          startTime: new Date(Date.now() + 100000).toISOString(),
          endTime: new Date(Date.now() + 200000).toISOString(),
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 100);
    });

    it('should get my bookings', async () => {
       (jwt.verify as jest.Mock).mockReturnValue({ id: 2, role: 'STUDENT' });
       (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 2, role: 'STUDENT' });
       
       (prisma.booking.findMany as jest.Mock).mockResolvedValue([
           {
               id: 100,
               studentId: 2,
               tutorId: 1,
               status: 'PENDING',
               student: {},
               tutor: {}
           }
       ]);
       
       const res = await request(app)
        .get('/api/bookings/me')
        .set('Cookie', ['token=mock_token']);
        
       expect(res.status).toBe(200);
       expect(Array.isArray(res.body)).toBe(true);
       expect(res.body.length).toBe(1);
    });

    it('should update booking status (accept)', async () => {
       // Mock auth as tutor
       (jwt.verify as jest.Mock).mockReturnValue({ id: 1, role: 'TUTOR' });
       (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, role: 'TUTOR' });
       
       (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
           id: 100,
           tutorId: 1,
           studentId: 2,
           status: 'PENDING'
       });
       
       (prisma.booking.update as jest.Mock).mockResolvedValue({
           id: 100,
           status: 'CONFIRMED'
       });

       const res = await request(app)
        .patch('/api/bookings/100')
        .set('Cookie', ['token=mock_token'])
        .send({ status: 'CONFIRMED' });
       
       expect(res.status).toBe(200);
       expect(res.body).toHaveProperty('status', 'CONFIRMED');
    });
  });
  
  describe('Review Routes', () => {
      it('should create a review', async () => {
        // Mock auth as student
        (jwt.verify as jest.Mock).mockReturnValue({ id: 2, role: 'STUDENT' });
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 2, role: 'STUDENT' });
        
        // Mock existing booking check
        (prisma.booking.findFirst as jest.Mock).mockResolvedValue({ id: 100 });
        
        // Mock tutor profile check
        (prisma.tutorProfile.findUnique as jest.Mock).mockResolvedValue({ id: 5, userId: 1 });
        
        (prisma.review.create as jest.Mock).mockResolvedValue({
            id: 1,
            studentId: 2,
            tutorId: 5,
            rating: 5,
            comment: 'Great!'
        });
        
        const res = await request(app)
            .post('/api/reviews')
            .set('Cookie', ['token=mock_token'])
            .send({
                tutorId: 1, // userId of tutor
                rating: 5,
                comment: 'Great!'
            });
            
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('comment', 'Great!');
      });
  });
});
