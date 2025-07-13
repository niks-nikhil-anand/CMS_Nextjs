import connectDB from "@/lib/dbConnect";
import CallDetailsModels from "@/models/CallDetailsModels";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    console.log("📞 [GET] /api/call-details/:dataId called");

    // Connect to the database
    console.log("🔗 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    console.log(params)

    const { data } = await params;
    console.log(`📌 Fetching call details for dataId: ${data}`);

    // Fetch call details
    const callDetails = await CallDetailsModels.find({ data: data}).populate("data");

    if (!callDetails || callDetails.length === 0) {
      console.log("⚠️ No call details found for this dataId");
      return NextResponse.json({ message: "No call details found" }, { status: 404 });
    }

    console.log(`✅ Found ${callDetails.length} call detail(s)`);
    console.log("🧾 Call Details:", JSON.stringify(callDetails, null, 2));

    return NextResponse.json({ message: "Call details fetched", callDetails }, { status: 200 });
  } catch (error) {
    console.error("💥 Error fetching call details:", error.message);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
};
