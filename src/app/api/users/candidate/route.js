import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import userModels from "@/models/userModels";
import mongoose from "mongoose";
import CandidateWelcomeEmail from "@/email/CandidateWelcomeEmail";
import { Resend } from "resend";



const resend = new Resend(process.env.RESEND_API_KEY);


export const POST = async (req) => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected.");

    const body = await req.json();
    const { fullName, email, password, role, managerId } = body;

    // Basic validations
    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check for existing user
    const existingUser = await userModels.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }

    let manager = null;

    // Handle candidate logic
    if (role === "Candidate") {
      if (!managerId) {
        return NextResponse.json({ message: "Manager ID is required for candidates" }, { status: 400 });
      }

      if (!mongoose.Types.ObjectId.isValid(managerId)) {
        return NextResponse.json({ message: "Invalid manager ID format" }, { status: 400 });
      }

      // 🔍 Step 1: Find the manager
      manager = await userModels.findById(managerId);
      if (!manager || manager.role !== "Manager") {
        return NextResponse.json({ message: "Valid manager not found" }, { status: 400 });
      }
    }

    // 🔐 Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 📄 Step 3: Create user
    const newUser = await userModels.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      ...(role === "Candidate" && managerId && { managerId })
    });

    // 🔗 Step 4: Link candidate to manager
    if (role === "Candidate" && managerId) {
      const updatedManager = await userModels.findByIdAndUpdate(
        managerId,
        { $addToSet: { candidates: newUser._id } },
        { new: true }
      );

      if (!updatedManager) {
        // Rollback
        await userModels.findByIdAndDelete(newUser._id);
        return NextResponse.json(
          { message: "Failed to link candidate to manager. Rolled back." },
          { status: 500 }
        );
      }
    }

     await resend.emails.send({
      from: 'no-reply@JonoJivan.com',
      to: email,
      subject: 'Welcome to JonoJivan',
      react: <CandidateWelcomeEmail fullName={fullName} />,
    });
    console.log("Welcome email sent to:", email);


    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          ...(managerId && { managerId })
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === 11000) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ message: "Validation failed", errors: validationErrors }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};
