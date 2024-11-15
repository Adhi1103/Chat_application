"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*", // Correct production URL
})); // Apply the CORS configuration
//app.options('*', cors()); // Handle preflight requests
console.log("hello there");
const port = process.env.PORT || 3000;
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// In express the callback function in express routes we should not use return it is used in hono only 
app.get("/", function (req, res) {
    res.json({ message: "Hello" });
});
//new route added 
app.get("/api/v1/user/signin", function (req, res) {
    res.json({ message: "hello" });
});
app.post('/api/v1/user/signup', async function (req, res) {
    const prisma = new client_1.PrismaClient();
    const { username, password, email } = req.body;
    // Check if username already exists
    try {
        const user_find = await prisma.user.findFirst({ where: { username, email } });
        if (user_find) {
            res.status(400).json({ message: 'Username already exists' });
        }
        else {
            // Create new user
            const value = await prisma.user.create({ data: { email, password, username } });
            // Sign JWT
            const token = (0, jsonwebtoken_1.sign)({ id: value.id, user: value.username }, process.env.JWT_SECRET || ""); // Ensure JWT_SECRET is a string
            res.json({ token: token, message: "User signed up", username: value.username });
        }
    }
    catch (e) {
        res.send(e);
    }
});
app.post("/api/v1/user/signin", function (req, res) {
    const prisma = new client_1.PrismaClient();
    const { email, password } = req.body;
    try {
        console.log("hello from siginin ");
        prisma.user.findFirst({ where: { email: email, password: password } }).then(function (user) {
            if (user) {
                console.log("hello from user");
                const token = (0, jsonwebtoken_1.sign)({ id: user.id, user: user.username }, process.env.JWT_SECRET);
                res.json({ message: "sign in successfull", token: token, username: user.username });
            }
            else {
                res.json({ message: "Invalid email or password" });
            }
        });
    }
    catch (e) {
        res.send(e);
    }
});
app.get("/api/v1/user/bulk", middleware_1.user_check, async function (req, res) {
    const user = req.query.name;
    const username = req.username;
    try {
        const prisma = new client_1.PrismaClient();
        if (typeof user === "string") {
            const users = await prisma.user.findMany({ where: { username: { contains: user, mode: "insensitive" } }, select: { username: true } });
            if (users) {
                const final_users = users.filter(function (user) {
                    return (user.username !== username);
                });
                res.json({ users: final_users });
            }
        }
    }
    catch (e) {
    }
});
app.post("/api/v1/user/add/friends", middleware_1.user_check, async function (req, res) {
    const friend = req.body.username;
    const name = req.username;
    try {
        const prisma = new client_1.PrismaClient();
        const users = await prisma.user.findUnique({ where: { username: name }, select: { friends: true } });
        if (users && !users.friends.includes(friend)) {
            const value = await prisma.user.update({ where: { username: name }, data: { friends: { push: friend } } });
            res.json({ message: "friend added sucessfully", updated_user: value });
        }
        else {
            res.json({ message: "Already added as friend" });
        }
    }
    catch (e) {
        console.log(e);
    }
});
app.get('/api/v1/user/friends', middleware_1.user_check, async function (req, res) {
    const username = req.username;
    try {
        const prisma = new client_1.PrismaClient();
        const value = await prisma.user.findFirst({ where: { username: username }, select: { friends: true, id: true, username: true } });
        if (value) {
            res.json({ friends: value.friends, username: value.username });
        }
    }
    catch (e) {
        console.log(e);
    }
});
app.post("/api/v1/user/message/:username", middleware_1.user_check, middleware_1.is_friend, async function (req, res) {
    const message = req.body.content;
    const name = String(req.username);
    const username = req.params.username;
    try {
        const prisma = new client_1.PrismaClient();
        const value = await prisma.message.create({ data: { content: message, senderName: name, sendTo: username } });
        res.json({ message: "Message sent sucessfully", message_model: value });
    }
    catch (e) {
        console.log(e);
    }
});
app.get("/api/v1/user/sent/messages/:username", middleware_1.user_check, middleware_1.is_friend, async function (req, res) {
    const name = String(req.username);
    console.log(req.params.username);
    const username = req.params.username;
    try {
        const prisma = new client_1.PrismaClient();
        const messages = await prisma.message.findMany({ where: { senderName: name, sendTo: username }, select: { content: true, senderName: true, sendTo: true, createdAt: true } });
        if (messages) {
            res.json({ messages: messages });
        }
        else {
            res.json({ message: "no message exist" });
        }
    }
    catch (e) {
        console.log(e);
    }
});
app.get("/api/v1/user/received/messages/:username", middleware_1.user_check, middleware_1.is_friend, async function (req, res) {
    const username = req.username;
    const name = String(req.params.username);
    try {
        const prisma = new client_1.PrismaClient();
        const messages = await prisma.message.findMany({ where: { senderName: name, sendTo: username }, select: { content: true, senderName: true, sendTo: true, createdAt: true } });
        if (messages) {
            res.json({ messages: messages });
        }
        else {
            res.json("no message exist");
        }
    }
    catch (e) {
        console.log(e);
    }
});
app.delete("/api/v1/user/messages", middleware_1.user_check, async function (req, res) {
    const id = Number(req.query.id);
    try {
        const prisma = new client_1.PrismaClient();
        const value = await prisma.message.delete({ where: { id: id } });
        if (value) {
            res.json({ message: "message deleted" });
        }
        else {
            res.json({ message: "message not exist" });
        }
    }
    catch (e) {
        console.log(e);
    }
});
const Server = app.listen(port, () => {
    console.log(`Server is running on 3000`);
});
// Create WebSocket server
const wss = new ws_1.WebSocket.Server({ server: Server });
// Store clients with their usernames
const clients = new Map();
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    console.log("hi from onconnection");
    // Handle incoming messages from clients
    ws.on('message', function (message) {
        const dataString = message.toString(); // Convert RawData to string
        const data = JSON.parse(dataString); // Assuming message is JSON-formatted
        const { type, username, target, content } = data;
        if (type === 'register') {
            // Register the client with their username
            clients.set(username, ws);
            // console.log(`User ${username} connected`);
        }
        if (type === 'message' && target) {
            // Send a message to the target user
            const targetClient = clients.get(target);
            if (targetClient && targetClient.readyState === ws_1.WebSocket.OPEN) {
                targetClient.send(JSON.stringify(content));
            }
            else {
                ws.send(`User ${target} is not connected.`);
            }
        }
    });
    ws.on('close', function () {
        // Remove the client from the map when they disconnect
        for (let [username, client] of clients.entries()) {
            if (client === ws) {
                clients.delete(username);
                break;
            }
        }
    });
});
