"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
const bookingSchema = zod_1.z.object({
    tutorId: zod_1.z.coerce.number().int(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
});
router.post("/", auth_1.auth, (0, validate_1.validate)(bookingSchema), async (req, res) => {
    const { tutorId, startTime, endTime } = req.body;
    const studentId = req.user?.id;
    if (!studentId)
        return res.status(401).json({ error: "Unauthorized" });
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (!(start instanceof Date) || isNaN(start.getTime()) || !(end instanceof Date) || isNaN(end.getTime()) || start >= end) {
        return res.status(400).json({ error: "Invalid time range" });
    }
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const overlap = await tx.booking.findFirst({
            where: {
                tutorId,
                status: { not: "CANCELLED" },
                startTime: { lt: end },
                endTime: { gt: start },
            },
        });
        if (overlap) {
            throw new Error("Time slot not available");
        }
        const booking = await tx.booking.create({
            data: {
                studentId,
                tutorId,
                startTime: start,
                endTime: end,
            },
        });
        return booking;
    });
    return res.json(result);
});
exports.default = router;
router.get("/me", auth_1.auth, async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const bookings = await prisma_1.prisma.booking.findMany({
        where: {
            OR: [{ studentId: userId }, { tutorId: userId }],
        },
        orderBy: { startTime: "asc" },
    });
    return res.json(bookings);
});
