import { PrismaClient } from "@prisma/client/extension";
import express from "express";
// import {Request,Response} from "express";
const PORT = 3000;
const app = express();
app.use(express.json());
const prisma = new PrismaClient();
async function createTeacher(id, email, name) {
    const newTeacher = await prisma.teacher.create({
        data: {
            id,
            email,
            name
        }
    });
    console.log(newTeacher);
}
;
app.get("/teacher/create", async (req, res) => {
    createTeacher("2332233", "amoghdath233@gmail.com", "amogh");
    res.json({
        message: "Teacher Created successfully"
    });
});
app.get("/", (req, res) => {
    res.json({
        message: "All good, Server is up"
    });
});
app.listen(PORT, () => {
    console.log(`Server Is Running At http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map