import express from "express";
import type { Response, Request } from "express";
import { prisma } from './prisma.js';
import adminRouter from '../routes/admin/admin.js';
import studentRouter from '../routes/student/student.js';
import teacherRouter from '../routes/teacher/teacher.js';
import mentorRouter from '../routes/mentor/mentor.js';
const app = express();
app.use(express.json());
app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/mentor", mentorRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "server is running ",
        condition: "all set"
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});