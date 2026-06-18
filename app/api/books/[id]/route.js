import { NextResponse } from "next/server";
import { connectionDb } from "@/dbConfig/dbConfig";
import Book from "@/models/dbModel";

export async function PUT(req, { params }) {
   try {
      await connectionDb();
       const { id } = await params;
         const body = await req.json();

          const updatedBook = await Book.findByIdAndUpdate(
            id,
             {
              $set: body,
             },
             { new: true }
            );
         
         if (!updatedBook) {
          return NextResponse.json({
            success: false,
            message: "Book not found",
          });
        }

       return NextResponse.json({
         success: true,
         data: updatedBook,
       });

      } catch (error) {
         console.log(error);
         return NextResponse.json({
         success: false,
         message: error.message,
      });
   }
}


export async function DELETE(req, { params }) {
  try {
    await connectionDb();
    const { id } = await params;
    const deletedData = await Book.findByIdAndDelete(id);
    console.log("deletedData========", deletedData);

    return NextResponse.json({
      success: true,
      deletedData,
    });

    } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}