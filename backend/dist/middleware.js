"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_check = user_check;
exports.is_friend = is_friend;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const jwt_password = process.env.JWT_SECRET;
async function user_check(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (token) {
            const value = (0, jsonwebtoken_1.verify)(token, jwt_password);
            if (typeof value === 'object' && value !== null) {
                req.id = value.id;
                req.username = value.user;
                next();
            }
        }
        else {
            res.send("Token not provided");
        }
    }
    catch (e) {
        console.log(e);
    }
}
async function is_friend(req, res, next) {
    const username = req.params.username;
    const user = req.username;
    try {
        const prisma = new client_1.PrismaClient();
        const result = await prisma.user.findFirst({ where: { username: user }, select: { friends: true } });
        if (result) {
            const friend = result.friends;
            if (friend.includes(username)) {
                next();
            }
            else {
                res.json({ message: "Your are not friends with each other" });
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}
