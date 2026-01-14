import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth';
import { tutorsRouter } from './routes/tutors';
import { bookingsRouter } from './routes/bookings';

const app = express();

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/tutors', tutorsRouter);
app.use('/api/bookings', bookingsRouter);

export default app;
