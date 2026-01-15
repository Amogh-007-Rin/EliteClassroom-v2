"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const subject = typeof req.query.subject === "string" ? req.query.subject : undefined;
    const tutors = await prisma_1.prisma.tutorProfile.findMany({
        where: subject
            ? {
                subjects: {
                    some: {
                        subject: {
                            name: { contains: subject, mode: "insensitive" },
                        },
                    },
                },
            }
            : undefined,
        select: {
            id: true,
            bio: true,
            hourlyRate: true,
            verified: true,
            subjects: { select: { subject: { select: { name: true } } } },
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
    });
    return res.json(tutors.map((t) => ({
        id: t.id,
        bio: t.bio,
        hourlyRate: t.hourlyRate,
        verified: t.verified,
        subjects: t.subjects.map((s) => s.subject.name),
        user: {
            id: t.user.id,
            firstName: t.user.firstName,
            lastName: t.user.lastName,
            email: t.user.email,
        },
    })));
});
exports.default = router;
