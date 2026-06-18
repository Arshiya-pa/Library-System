import { connectionDb } from "@/dbConfig/dbConfig";
import User from '@/models/userModel';
import { NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';    //npm i bcryptjs

export async function POST(request){
    try {
         await connectionDb()
         const{FullName,Email,Password} = await request.json()
         const user = await User.findOne({Email})
         if(user){
            return NextResponse.json({
                message: "This Email is already exist"
            })
         }
           const salt = await bcryptjs.genSalt(10)
           const hashedPassword = await bcryptjs.hash(Password,salt)
           const newUser = new User({
              FullName,
              Email,
              Password:hashedPassword,})
              await newUser.save()
              return NextResponse.json({message:"New user Added", data:newUser,success: true},{status:201})    
        
         } catch (error) {
            console.log("Error is",error)
           return NextResponse.json(
            {error:error.message},
            {status:500}
         )
    }
}