import { connectionDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {

  try {

    await connectionDb();

    // Get request body
    const body = await req.json();
    const { Email, Password } = body;
    // Find User
    const user = await User.findOne({ Email });

    // Check user exists
    if (!user) {

      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }

    // Compare Password
    const isMatch = await bcryptjs.compare(
      Password,
      user.Password
    );

    // Invalid password
    if (!isMatch) {

      return NextResponse.json(
        {
          success: false,
          message: "Invalid Password",
        },
        {
          status: 401,
        }
      );
    }

    // Generate JWT Token
      const token = jwt.sign(
      {
        id: user._id,
        Email: user.Email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Success Response
    return NextResponse.json({
      success: true,
      message: "Login Successful",
      token,

      user: {
        id: user._id,
        FullName: user.FullName,
        Email: user.Email,
      },
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}