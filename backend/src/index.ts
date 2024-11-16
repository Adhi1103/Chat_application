import express, {Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { is_friend, user_check } from './middleware';
import cors from 'cors';

import { WebSocketServer,WebSocket } from 'ws'

const port =process.env.PORT||3000
dotenv.config();

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://chat-application-k64c.vercel.app"); // Frontend origin
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})

app.use(cors({
    origin: "https://chat-application-k64c.vercel.app", // Replace with your frontend's URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
credentials:true
}));

app.options("*", cors()); // Handle preflight requests
app.use(express.json());

// In express the callback function in express routes we should not use return it is used in hono only 
app.get("/",function(req:Request,res:Response){
    res.json({message:"Hello"});
});
//new route added 
app.get("/api/v1/user/signin", function(req:Request,res:Response){
    res.json({message:"hello"});
})
app.post('/api/v1/user/signup', async  function(req: Request, res: Response) {
  const prisma = new PrismaClient();
  
  const { username, password, email } = req.body;

  // Check if username already exists
  try{
    const user_find = await prisma.user.findFirst({ where: { username,email } });
    if (user_find) {
        res.status(400).json({ message: 'Username already exists' });
     }

     else{
  // Create new user
  const value = await prisma.user.create({ data: { email, password, username } });

  // Sign JWT
  const token = sign({ id: value.id, user: value.username }, process.env.JWT_SECRET||"" ); // Ensure JWT_SECRET is a string

    res.json({ token: token,message:"User signed up",username:value.username });
     }
  }
 catch(e){
    res.send(e);
 }


});

app.post("/api/v1/user/signin", async (req: Request, res: Response) => {
    const prisma = new PrismaClient();
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findFirst({ where: { email, password } });
        if (user) {
            const token = sign({ id: user.id, user: user.username }, process.env.JWT_SECRET as string);
            res.json({ message: "Sign-in successful", token, username: user.username });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (e) {
        res.status(500).json({ message: "An error occurred", error: e });
    }
});

app.get("/api/v1/user/bulk",user_check,async function(req:Request,res:Response){
    const user=req.query.name;
     const username=req.username;

    try{
        const prisma=new PrismaClient();
        if(typeof user==="string" ){
            const users=await prisma.user.findMany({where:{username:{contains:user,mode:"insensitive"}},select:{username:true}});
            if(users){
                const final_users=users.filter(function(user){
return(user.username!==username)
                });
    
                res.json({users:final_users});
            }
        }

    }
    catch(e){
    }
})
app.post("/api/v1/user/add/friends",user_check,async function(req:Request,res:Response){
    const friend=req.body.username;
    const name=req.username;

try{
    const prisma=new PrismaClient();
    const users=await prisma.user.findUnique({where:{username:name},select:{friends:true}});
    if(users&&!users.friends.includes(friend)){
        const value=await prisma.user.update({where:{username:name},data:{friends:{push:friend}}});
        res.json({message:"friend added sucessfully",updated_user:value});

    }
    else{
        res.json({message:"Already added as friend"})
    }

    }
    catch(e){
console.log(e);
    }
});




app.get('/api/v1/user/friends',user_check,async function(req: Request, res: Response) {
    const username=req.username;
    try{
        const prisma=new PrismaClient();

const value=await prisma.user.findFirst({where:{username:username},select:{friends:true,id:true,username:true}});
if( value){
    
        res.json({friends:value.friends,username:value.username});
    
  
}

    }
    catch(e){
console.log(e);
    }

});

app.post("/api/v1/user/message/:username",user_check,is_friend,async function(req:Request,res:Response){
    const message=req.body.content;
    const name=String(req.username);
    
    const username=req.params.username;
    try{
        const prisma=new PrismaClient();
        const value= await prisma.message.create({data:{content:message,senderName:name,sendTo:username}});

      res.json({message:"Message sent sucessfully",message_model:value})
    }
catch(e){
    console.log(e);
}
});

app.get("/api/v1/user/sent/messages/:username",user_check,is_friend,async function(req:Request,res:Response){
const name=String(req.username);
console.log(req.params.username);
const username=req.params.username;
try{
    const prisma=new PrismaClient();
    const messages=await prisma.message.findMany({where:{senderName:name,sendTo:username},select:{content:true,senderName:true,sendTo:true,createdAt:true}});
    
    if(messages){
        res.json({messages:messages});
    }
    else{
        res.json({message:"no message exist"});
    }
}
catch(e){
    console.log(e)
}
})

app.get("/api/v1/user/received/messages/:username",user_check,is_friend,async function(req:Request,res:Response){
    const username=req.username;
    const name=String(req.params.username);
    

    try{
        const prisma=new PrismaClient();
        
            const messages=await prisma.message.findMany({where:{senderName:name,sendTo:username},select:{content:true,senderName:true,sendTo:true,createdAt:true}})
            if(messages){
                res.json({messages:messages});
            }
            else{
                res.json("no message exist");
            }
        
       
    }
    catch(e){
        console.log(e);
    }

});










app.delete("/api/v1/user/messages",user_check,async function(req:Request,res:Response){
    const id=Number(req.query.id);
    try{
        const prisma=new PrismaClient();
        const value= await prisma.message.delete({where:{id:id}});
        if(value){
    res.json({message:"message deleted"});
        }
        else{
            res.json({message:"message not exist"});
        }
    }
    catch(e){
        console.log(e);
    }
})
const Server=app.listen(port, () => {
  console.log(`Server is running on 3000`);
});


// Create WebSocket server
const wss = new WebSocket.Server({ server:Server  });

// Store clients with their usernames
const clients = new Map();

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
console.log("hi from onconnection");
  // Handle incoming messages from clients
  ws.on('message', function (message) {
    const dataString = message.toString(); // Convert RawData to string
    const data = JSON.parse(dataString);  // Assuming message is JSON-formatted
    const { type, username, target, content } = data;

    if (type === 'register') {
      // Register the client with their username
      clients.set(username, ws);
     // console.log(`User ${username} connected`);
    
    }

    if (type === 'message' && target) {
      // Send a message to the target user
      const targetClient = clients.get(target);
      if (targetClient && targetClient.readyState === WebSocket.OPEN) {
        
        targetClient.send(JSON.stringify(content));
      } else {
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
