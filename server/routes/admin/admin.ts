import { prisma } from '../../src/prisma.js';
import express from 'express';
import {adminMiddleware, checkDuplicateAdmin} from '../../middleware/adminMiddleware.js'
import type { Request, Response} from 'express';
import {Router} from 'express';
import multer from 'multer';
const upload = multer();
const router = Router();
router.use(express.json());

router.post("/create", upload.none(), checkDuplicateAdmin, async function(req: Request, res: Response){
    const fullName = req.body.fullName;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const contact = parseInt(req.body.contact);

    const newAdmin = await prisma.admin.create({
        data:{
            fullName,
            email,
            username,
            password,
            contact
        }
    });
    res.json({
        admin : newAdmin.username,
        message : "Admin the following username created successfully",
    });

    console.log(newAdmin);

});

router.post("/login", adminMiddleware, async function (req: Request, res: Response){
    res.status(200).json({message: "Login Successful"});
});

export default router;