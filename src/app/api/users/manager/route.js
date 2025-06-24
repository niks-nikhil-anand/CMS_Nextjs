import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected.");

    const managers = await userModels
      .find({ role: "Manager", status: "Active" }) 
      .select("-password"); 

    return NextResponse.json(
      { message: "Candidates fetched successfully", managers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching candidates:", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};
