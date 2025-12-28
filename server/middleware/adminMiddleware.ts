// Admin Middleware will be added here
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../src/prisma.js';


// AdminMiddleware for login authentication
export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    try {
        const isAdmin = await prisma.admin.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ],
                password: password // Password is required regardless of which ID they used
            }
        });

        if (!isAdmin) {
            // Stop and return error
            res.status(403).json({ msg: "Admin not found / Unauthorized" });
            return;
        };

        // 5. Proceed to the next controller
        next();

    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    };

};

// checkDuplicateAdmin middleware to create unique admin and reject duplicate admin creation
export async function checkDuplicateAdmin(req: Request, res: Response, next: NextFunction) {
    const { username, email } = req.body;
    const contact = parseInt(req.body.contact);

    try {
        const duplicateAdmin = await prisma.admin.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                    { contact }
                ]
            }
        });

        if (duplicateAdmin) {
            res.status(500).json({ message: "Admin with this credentials already exits" });
            return;
        };

        next();

    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
};