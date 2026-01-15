import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import tutorsRouter from "./routes/tutors";
import bookingsRouter from "./routes/bookings";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/tutors", tutorsRouter);
app.use("/api/bookings", bookingsRouter);

export default app;
