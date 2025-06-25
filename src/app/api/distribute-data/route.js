import connectDB from "@/lib/dbConnect";
import dataModels from "@/models/dataModels";
import distributedDonorData from "@/models/distributedDonorData";
import uploadFileModels from "@/models/uploadFileModels";
import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file");
    const managerId = formData.get("managerId");
    const candidateIds = JSON.parse(formData.get("candidateIds") || "[]");
    const distributionMethod = formData.get("distributionMethod");

    if (!file || !managerId || !candidateIds.length) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!file.name?.endsWith(".csv") && file.type !== "text/csv") {
      return NextResponse.json({ message: "Invalid file format" }, { status: 400 });
    }

    const fileContent = await file.text();
    if (!fileContent.trim()) {
      return NextResponse.json({ message: "CSV file is empty" }, { status: 400 });
    }

    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
      transform: (v) => (typeof v === "string" ? v.trim() : v),
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json({
        message: "CSV parsing error",
        errors: parsed.errors.map((e) => e.message),
      }, { status: 400 });
    }

    const csvData = parsed.data.filter((row) =>
      Object.values(row).some((v) => v !== "" && v != null)
    );

    if (!csvData.length) {
      return NextResponse.json({ message: "CSV contains no valid rows" }, { status: 400 });
    }

    const headers = Object.keys(csvData[0]);
    const required = ["full_name", "email", "phone"];
    const missing = required.filter((r) => !headers.includes(r));
    if (missing.length) {
      return NextResponse.json({ message: `Missing columns: ${missing.join(", ")}` }, { status: 400 });
    }

    // Save each data row
    const dataRecords = [];
    for (const row of csvData) {
      const additionalFields = new Map();
      Object.entries(row).forEach(([key, val]) => {
        if (!required.includes(key) && val !== null) {
          additionalFields.set(key, val);
        }
      });

      const newRecord = new dataModels({
        fullName: row.full_name,
        email: row.email.toLowerCase(),
        phone: row.phone,
        additionalFields,
      });

      const saved = await newRecord.save();
      dataRecords.push(saved);
    }

    // Distribute data to candidates
    const chunks = [];
    const distributedDataIds = [];

    if (distributionMethod === "equal") {
      const per = Math.floor(dataRecords.length / candidateIds.length);
      const extra = dataRecords.length % candidateIds.length;
      let index = 0;

      candidateIds.forEach((id, i) => {
        const count = per + (i < extra ? 1 : 0);
        chunks.push({ id, data: dataRecords.slice(index, index + count) });
        index += count;
      });
    } else {
      const shuffled = [...dataRecords].sort(() => 0.5 - Math.random());
      const per = Math.floor(shuffled.length / candidateIds.length);
      let index = 0;

      candidateIds.forEach((id, i) => {
        const count = per + (i < shuffled.length % candidateIds.length ? 1 : 0);
        chunks.push({ id, data: shuffled.slice(index, index + count) });
        index += count;
      });
    }

    for (const chunk of chunks) {
      const distRecord = new distributedDonorData({
        candidate: chunk.id,
        data: chunk.data.map((d) => d._id),
        distributedBy: managerId,
        time: new Date(),
      });

      const saved = await distRecord.save();
      distributedDataIds.push(saved._id);
    }

    // Save UploadFile with minimal fields as per schema
    const uploadFile = new uploadFileModels({
      fileName: file.name,
      distributedData: distributedDataIds,
      fileType: ".csv",
      fileSize: file.size,
      totalRows: csvData.length,
      totalColumns: headers.length,
      uploadedBy: managerId,
      manager: [managerId],
      candidates: candidateIds,
    });

    const savedUpload = await uploadFile.save();

    return NextResponse.json({
      message: "Success",
      uploadFileId: savedUpload._id,
      totalData: dataRecords.length,
      distributedTo: candidateIds.length,
    });

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      {
        message: "Server error while uploading/distributing",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
