import { NextFunction,Request,Response } from "express";
import { verify } from "jsonwebtoken";
import { string } from "zod";
import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";

dotenv.config();

const jwt_password=process.env.JWT_SECRET;

 export async function user_check(req:Request,res:Response,next:NextFunction){

  try{
    const token=req.headers.authorization;
    if(token){
 const value=verify(token, jwt_password as string);
 if(typeof value==='object' && value!==null){
  req.id=value.id;
req.username=value.user;
next();
 }
 
    }
    else{
      res.send("Token not provided")
    }
   
  }
catch(e){
  console.log(e);

}
}
export async function is_friend(req:Request,res:Response,next:NextFunction){
  const username=req.params.username;
  
  
  const user=req.username;
  try{
    const prisma=new PrismaClient();
    const result= await prisma.user.findFirst({where:{username:user},select:{friends:true}});
    if(result){
      const friend=result.friends;
      if(friend.includes(username)){
       
        next();
      }

      else{
        res.json({message:"Your are not friends with each other"})
      }
    }
  }
  catch(e){
    console.log(e);
  }

}