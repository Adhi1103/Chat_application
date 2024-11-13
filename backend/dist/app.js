"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response_func = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const response_func = async function (req, res) {
    const prisma = new client_1.PrismaClient();
    const { username, password, email } = req.body;
    // Check if username already exists
    const user_find = await prisma.user.findFirst({ where: { username } });
    if (user_find) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    // Create new user
    const value = await prisma.user.create({ data: { email, password, username } });
    // Sign JWT
    const token = (0, jsonwebtoken_1.sign)({ id: value.id, user: value.username }, process.env.JWT_SECRET); // Ensure JWT_SECRET is a string
    return res.send({ message: token });
};
exports.response_func = response_func;
