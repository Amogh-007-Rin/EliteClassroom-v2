"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const tutors_1 = __importDefault(require("./routes/tutors"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/api/auth", auth_1.default);
app.use("/api/tutors", tutors_1.default);
app.use("/api/bookings", bookings_1.default);
exports.default = app;
