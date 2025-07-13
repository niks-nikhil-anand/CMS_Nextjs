import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import dataModels from "@/models/dataModels";
import CallDetailsModels from "@/models/CallDetailsModels";

const JWT_SECRET = process.env.JWT_SECRET;

export const POST = async (req, { params }) => {
  try {
    console.log("Database is connecting")
    await connectDB();
    console.log("Database is connected")

    const { id } = params;
    console.log(id)


    // Validate Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No valid Authorization header found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("✅ JWT verified, user ID:", decoded.id);
    } catch (err) {
      console.error("❌ Invalid JWT token:", err.message);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const candidateId = decoded.id;

    // Fetch distributedDonorData by param id
    const Data = await dataModels.findById(id);

    if (!Data) {
      return NextResponse.json(
        { message: "Distributed data not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    console.log("📥 Received form data:", body);

    // Construct callDetails data
    const callDetailDoc = new CallDetailsModels({
      ...body,
      candidate: candidateId,
      data: Data._id,
    });

    await callDetailDoc.save();

    console.log("✅ Call details saved successfully");
    return NextResponse.json(
      { message: "Call details saved", callDetails: callDetailDoc },
      { status: 201 }
    );
  } catch (error) {
    console.error("💥 Error saving call details:", error.message);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};
