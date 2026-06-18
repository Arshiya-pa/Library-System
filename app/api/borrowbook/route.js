
import { connectionDb } from "@/dbConfig/dbConfig";
import Borrow from '@/models/borrowModel';
import { NextResponse } from "next/server";


 export async function POST(request){
    try {
         await connectionDb()
         const{UserId,FullName,Email,BookTitle,BookCount,BookIssueDate,BookReturnDate,ActualBookReturnDate,Status,Fine} = await request.json()
       
            const newBorrow = new Borrow({
              UserId,
              FullName,
              Email,
              BookTitle,
              BookCount,
              BookIssueDate,
              BookReturnDate,ActualBookReturnDate,
              Status,Fine})
             await newBorrow.save()
             return NextResponse.json({message:"New Book Entry Added", data:newBorrow,success: true},{status:201})  
        
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
       const borrowData = await Borrow.find();
       return NextResponse.json({
        borrowData,
       });
       } catch (error) {
      console.log(error);
    }
}