import { prisma } from '../../src/prisma.js';
import express from 'express';
import type { Request, Response} from 'express';
import {Router} from 'express';
import multer from 'multer';
const upload = multer();
const router = Router();
router.use(express.json());

router.post("/create", upload.none(), async function(req: Request, res: Response){
    const fullName = req.body.fullName;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const contact = parseInt(req.body.contact);

    const newStudent = await prisma.student.create({
        data:{
            fullName,
            email,
            username,
            password,
            contact
        }
    });
    res.json({
        student : newStudent.username,
        message : "New Student created successfully",
    });

    console.log(newStudent);

});

export default router;