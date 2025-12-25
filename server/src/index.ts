
import { PrismaClient } from "@prisma/client/extension";
import express from "express";
// import {Request,Response} from "express";
const PORT = 3000;
const app = express();
app.use(express.json());

const prisma = new PrismaClient()
async function createTeacher(id : String, email : String, name : String){
    const newTeacher = await prisma.teacher.create({
        data: {
            id,
            email,
            name
        }
    });
    console.log(newTeacher);
};

app.get("/teacher/create", async(req : any, res : any) => {

    createTeacher("2332233", "amoghdath233@gmail.com", "amogh");
    res.json({
        message : "Teacher Created successfully"
    })

});

app.get("/", (req : any, res : any) => {
    res.json({
        message : "All good, Server is up"
    })
});

app.listen(PORT, ()=> {
    console.log(`Server Is Running At http://localhost:${PORT}`);
});