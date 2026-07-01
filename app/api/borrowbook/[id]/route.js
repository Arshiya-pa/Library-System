import { NextResponse } from "next/server";
import { connectionDb } from "@/dbConfig/dbConfig";
import Borrows from "@/models/borrowModel";

export async function PUT(req, { params }) {
   try {
         await connectionDb();
           const { id } = await params;
           const body = await req.json();

         const updateBorrow = await Borrows.findByIdAndUpdate(
         id,
          {
            BookReturnDate:body.BookReturnDate,
            BookCount:body.BookCount,
            ReturnBookCount:body.ReturnBookCount,
            ActualBookReturnDate:body.ActualBookReturnDate,
            Status:body.Status,
            Fine:body.Fine
          },
        
           { new: true }
         );

         if (!updateBorrow) {
          return NextResponse.json({
            success: false,
            message: "No Updations",
          });
         }

         return NextResponse.json({
         success: true,
         data: updateBorrow,
         });

        } catch (error) {
         console.log(error);
         return NextResponse.json({
         success: false,
         message: error.message,
      });
   }
}