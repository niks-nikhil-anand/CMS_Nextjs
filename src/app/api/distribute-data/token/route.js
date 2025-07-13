import jwt from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import distributedDonorData from "@/models/distributedDonorData";
import dataModels from "@/models/dataModels";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";
const JWT_SECRET = process.env.JWT_SECRET;

export const GET = async (req, { params }) => {
 
  
  try {
    await connectDB();

    // Authorization header check
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No valid Authorization header found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("✅ JWT verification successful");
      console.log("👤 Decoded JWT payload:", {
        id: decoded.id,
        exp: decoded.exp,
        iat: decoded.iat,
        // Add other relevant fields you want to log
      });
    } catch (err) {
      console.error("❌ JWT verification failed:", err.message);
      console.error("🔍 Error details:", err.name);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    console.log("🔍 Query parameters:", { candidate: userId });
    
    const distributedData = await distributedDonorData.find({ candidate: userId })
      .populate("candidate")
      .populate("data"); 

    console.log("📊 Query results:", {
      found: distributedData ? distributedData.length : 0,
      isEmpty: !distributedData || distributedData.length === 0
    });

    if (!distributedData || distributedData.length === 0) {
      console.log("⚠️ No distributed data found for user:", userId);
      return NextResponse.json({ message: "No distributed data found" }, { status: 404 });
    }

    console.log("📋 Data summary:", {
      recordCount: distributedData.length,
      firstRecordId: distributedData[0]?._id,
      hasPopulatedCandidate: !!distributedData[0]?.candidate,
      hasPopulatedData: !!distributedData[0]?.data
    });

    return NextResponse.json(
      { message: "Data fetched successfully", data: distributedData },
      { status: 200 }
    );

  } catch (error) {
    console.error("💥 Unexpected error occurred:");
    console.error("❌ Error message:", error.message);
    console.error("📍 Error stack:", error.stack);
    console.error("🔍 Error name:", error.name);
    
    return NextResponse.json(
      { message: "Error fetching donor", error: error.message },
      { status: 500 }
    );
  }
};