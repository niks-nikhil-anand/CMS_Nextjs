import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import uploadFileModels from "@/models/uploadFileModels";
import distributedDonorData from "@/models/distributedDonorData";
import userModels from "@/models/userModels";

export async function GET() {
  try {
    console.log("[GET] /api/donors — Fetching donor list");
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected.");

    const donors = await uploadFileModels
      .find()
      .populate("distributedData")
      .populate("uploadedBy") // Populate uploader details

      .sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Donors fetched successfully", donors },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching donor data:", error);
    return NextResponse.json(
      { message: "Failed to fetch donor data", error: error.message },
      { status: 500 }
    );
  }
}
