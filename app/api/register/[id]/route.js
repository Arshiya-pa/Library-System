import { NextResponse } from "next/server";
import { connectionDb } from "@/dbConfig/dbConfig";
import Register from "@/models/registrationModel";

export async function PUT(req, { params }) {
    try {
         await connectionDb()
         const { id } = await params;
         const body = await req.json();
         
         const updatedUser = await Register.findByIdAndUpdate(
         id,
         body,
         { new: true });

           return NextResponse.json({
           message: "Data Updated",
           data: updatedUser
         });
         
        }catch (error) {
         return NextResponse.json(
            {error:error.message},
            {status:500}
        )
    }
}