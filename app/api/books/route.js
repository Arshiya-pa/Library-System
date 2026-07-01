
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { connectionDb } from "../../../dbConfig/dbConfig";
import Book from "../../../models/dbModel.js"


export async function POST(req) {

  try {
    await connectionDb();
    const data = await req.formData();
    console.log(data);
    const BookTitle = data.get("BookTitle");
    const AuthorName = data.get("AuthorName");
    const Publisher = data.get("Publisher");
    const PublicationYear = data.get("PublicationYear");
    const Edition = data.get("Edition");
    const Language = data.get("Language");
    const Category = data.get("Category");
    const Quantity = data.get("Quantity");
    const Status = data.get("Status");
    const BookImage = data.get("BookImage");

    let imagePath = "";

     if(BookImage) {
       
      console.log(BookImage);
      console.log(BookImage.name);

      const bytes = await BookImage.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const fileName = Date.now() + "-" + BookImage.name;

      const uploadPath = path.join(
        process.cwd(),
        "public/uploads",
        fileName
      );

      await writeFile(uploadPath,buffer);

      imagePath =`/uploads/${fileName}`; }

     const newBook = await Book.create({
          BookTitle,
          AuthorName,Publisher,PublicationYear,Edition,Language,
          Category,
          Quantity,
          Status,
          BookImage: imagePath,
      });

    return NextResponse.json({
    success: true,
    data: newBook, },{status: 201,});

    } catch (error) {
      console.log(error);
      return NextResponse.json({
      success: false,
      error: error.message,
   });
  }
}

// Get Books
export async function GET() {
  try {  
       await connectionDb();
       const bookdata = await Book.find();
       return NextResponse.json({
       success: true,
       books: bookdata,
       });
      } catch (error) {
        return NextResponse.json(
        {
        success: false,
        message: error.message,
       },
       { status: 500 }
    );
  }

}



