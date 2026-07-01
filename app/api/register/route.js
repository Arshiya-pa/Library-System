
import { connectionDb } from "@/dbConfig/dbConfig";
import Register from '@/models/registrationModel';
import { NextResponse } from "next/server";


 export async function POST(request){
    try {
         await connectionDb()
         const{UserId,FullName,Email,Phone,Address,MembershipPlan,MembershipFee} = await request.json()
         const register = await Register.findOne({UserId})

            if (register) {
              return NextResponse.json(
                { success: false,
                  message: "This ID already exists",
                },
                { status: 400 }
              );
            }
            const existingUser = await Register.findOne({ Email }); 
            if (existingUser) {
              return NextResponse.json(
                { success: false,
                  message: "Email already exists",
                },
                { status: 400 }
              );
            }
            const newRegister = new Register({
              UserId,
              FullName,
              Email,
              Phone,
              Address,MembershipPlan,MembershipFee,})
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