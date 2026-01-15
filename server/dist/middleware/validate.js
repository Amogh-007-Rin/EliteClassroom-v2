"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request body", issues: parsed.error.issues });
    }
    req.body = parsed.data;
    next();
};
exports.validate = validate;
