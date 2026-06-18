
import { connectionDb } from "@/dbConfig/dbConfig";
import Register from '@/models/registrationModel';
import { NextResponse } from "next/server";


 export async function POST(request){
    try {
         await connectionDb()
         const{UserId,FullName,Email,Phone,Address} = await request.json()
         const register = await Register.findOne({UserId})

         if(register){
            return NextResponse.json({
                message: "This ID is already exist"
            })
         }
           const newRegister = new Register({
              UserId,
              FullName,
              Email,
              Phone,
              Address,})
             await newRegister.save()
             return NextResponse.json({message:"New Registration Completed", data:newRegister,success: true},{status:201})  
        
           } catch (error) {
            console.log("Error is",error)
             return NextResponse.json(
            {error:error.message},
            {status:500}
         )
    }
}



export async function GET() {

   try {
      await connectionDb();
      const users = await Register.find();
       console.log("Register User", users);

       return NextResponse.json({
         success: true,
         registerData: users,
      });

   } catch (error) {
      return NextResponse.json({
         success: false,
         message: error.message,
      });
   }
}