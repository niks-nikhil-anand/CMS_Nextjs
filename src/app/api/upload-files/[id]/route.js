import connectDB from "@/lib/dbConnect";
import distributedDonorData from "@/models/distributedDonorData";
import uploadFileModels from "@/models/uploadFileModels";
import { NextResponse } from "next/server";
import userModels from "@/models/userModels";
import dataModels from "@/models/dataModels";

export const GET = async (req, { params }) => {
  try {
    console.log("[GET] /api/uploaded/:id — Fetching uploaded file with distributed data");

    await connectDB();
    console.log("✅ Database connected");

    const { id } = await params;
    console.log("🆔 Upload File ID:", id);

    // Step 1: Find uploaded file
    const uploadFile = await uploadFileModels
      .findOne({ _id: id })
      .populate('uploadedBy', 'name email')
      .populate('manager', 'name email')
      .populate('candidates', 'name email');

    if (!uploadFile) {
      console.warn("⚠️ Upload file not found for ID:", id);
      return NextResponse.json({ message: "Upload file not found" }, { status: 404 });
    }

    console.log("📄 Upload file found:", uploadFile.fileName);

    // Step 2: Get distributed files
    const distributedFiles = await distributedDonorData
      .find({ _id: { $in: uploadFile.distributedData } })
      .populate('candidate', 'name email')
      .populate('distributedBy', 'name email')
      .lean();

    console.log(`📦 Found ${distributedFiles.length} distributed records`);

    // Step 3: Add actual data to each distributed record
    const distributedFilesWithData = await Promise.all(
      distributedFiles.map(async (distributedFile, idx) => {
        const dataRecords = await dataModels
          .find({ _id: { $in: distributedFile.data } })
          .lean();

        console.log(`🔍 [${idx + 1}] Distributed file ${distributedFile._id} has ${dataRecords.length} data records`);

        return {
          _id: distributedFile._id,
          candidate: distributedFile.candidate._id,
          candidateName: distributedFile.candidate.name,
          candidateEmail: distributedFile.candidate.email,
          data: dataRecords.map(record => {
            // Handle additionalFields safely
            let additionalFields = {};
            
            if (record.additionalFields) {
              if (Array.isArray(record.additionalFields)) {
                // If it's an array of key-value pairs, use Object.fromEntries
                try {
                  additionalFields = Object.fromEntries(record.additionalFields);
                } catch (error) {
                  console.warn("⚠️ Error processing additionalFields as array:", error);
                  additionalFields = {};
                }
              } else if (typeof record.additionalFields === 'object') {
                // If it's already an object, use it directly
                additionalFields = record.additionalFields;
              } else if (record.additionalFields instanceof Map) {
                // If it's a Map, convert to object
                additionalFields = Object.fromEntries(record.additionalFields);
              }
            }

            return {
              _id: record._id,
              fullName: record.fullName,
              email: record.email,
              phone: record.phone,
              ...additionalFields,
              createdAt: record.createdAt,
              updatedAt: record.updatedAt
            };
          }),
          distributedBy: distributedFile.distributedBy._id,
          distributedByName: distributedFile.distributedBy.name,
          distributedByEmail: distributedFile.distributedBy.email,
          time: distributedFile.time,
          createdAt: distributedFile.createdAt,
          updatedAt: distributedFile.updatedAt
        };
      })
    );

    // Step 4: Prepare and return final response
    const responseData = {
      uploadedFile: {
        _id: uploadFile._id,
        fileName: uploadFile.fileName,
        fileType: uploadFile.fileType,
        fileSize: uploadFile.fileSize,
        totalRows: uploadFile.totalRows,
        totalColumns: uploadFile.totalColumns,
        uploadedBy: uploadFile.uploadedBy._id,
        uploadedByName: uploadFile.uploadedBy.name,
        uploadedByEmail: uploadFile.uploadedBy.email,
        manager: uploadFile.manager.map(mgr => ({
          _id: mgr._id,
          name: mgr.name,
          email: mgr.email
        })),
        candidates: uploadFile.candidates.map(candidate => ({
          _id: candidate._id,
          name: candidate.name,
          email: candidate.email
        })),
        createdAt: uploadFile.createdAt,
        updatedAt: uploadFile.updatedAt
      },
      distributedFiles: distributedFilesWithData
    };

    console.log("✅ Upload file with distributed data fetched successfully");

    return NextResponse.json(
      {
        message: "Upload file with distributed data fetched successfully",
        data: responseData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching upload file with distributed data:", error);
    return NextResponse.json(
      { message: "Error fetching upload file", error: error.message },
      { status: 500 }
    );
  }
};