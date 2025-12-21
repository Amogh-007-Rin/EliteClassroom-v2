import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to express server" });
});

app.get("/classroom/students", async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany();
    console.log("Students", JSON.stringify(students, null, 2));
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
