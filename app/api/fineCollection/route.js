
import { connectionDb } from "@/dbConfig/dbConfig";
import FineCollection from '@/models/fineModel';
import { NextResponse } from "next/server";


 export async function POST(request){
    try {
         await connectionDb()
           const{UserId,UserName,BookTitle,TotalFine,PaymentMethod,DueDate,DaysOverdue,FinePerDay,AmountPaid,PaymentDate} = await request.json()

            const newFineCollection = new FineCollection({
              UserId,UserName,BookTitle,TotalFine,
              PaymentMethod,DueDate,DaysOverdue,FinePerDay,AmountPaid,PaymentDate})
              await newFineCollection.save()
              return NextResponse.json({message:"New Fine is  Added", data:newFineCollection,success: true},{status:201})  
    
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

    const fineCollectionData = await FineCollection.find();
    return NextResponse.json({
      fineCollectionData,
    });
   } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Failed to fetch fine records" },
      { status: 500 }
    );
  }
}