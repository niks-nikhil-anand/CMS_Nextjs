import connectDB from "@/lib/dbConnect";
import dataModels from "@/models/dataModels";
import distributedDonorData from "@/models/distributedDonorData";
import uploadFileModels from "@/models/uploadFileModels";
import { NextResponse } from "next/server";
import Papa from "papaparse";

// Define all valid aliases for required fields:
const FIELD_ALIASES = {
  full_name: [
    "full_name", "fullname", "full name", "name", "first_name", "first name", "candidate name"
  ],
  email: [
    "email", "e-mail", "email address", "mail", "emailaddress", "e mail"
  ],
  phone: [
    "phone", "mobile", "phone number", "mobile number", "contact number", "cell", "cellphone"
  ]
};

// Utility to map CSV headers to canonical field names
function getFieldHeaderMap(headers, aliases) {
  const fieldMap = {};
  const normalized = headers.map(h => h.trim().toLowerCase());
  Object.entries(aliases).forEach(([canonical, keys]) => {
    const match = keys.find(opt => normalized.includes(opt));
    if (match) fieldMap[canonical] = headers[normalized.indexOf(match)];
  });
  return fieldMap;
}

// Converts a row (parsed by Papa) using the header map => standardized field object
function getRowStandardized(row, map) {
  return {
    full_name: map.full_name ? row[map.full_name] : undefined,
    email:     map.email     ? row[map.email]     : undefined,
    phone:     map.phone     ? row[map.phone]     : undefined,
  };
}

export async function POST(request) {
  try {
    console.log("----[1] Connecting Database...");
    await connectDB();
    console.log("----[2] Database connected successfully.");

    const formData = await request.formData();
    console.log("----[3] Received FormData.");

    const file = formData.get("file");
    const managerId = formData.get("managerId");
    const candidateIds = JSON.parse(formData.get("candidateIds") || "[]");
    const distributionMethod = formData.get("distributionMethod");
    console.log("----[3.a] Form fields extracted.", {
      fileName: file?.name,
      managerId,
      candidateIds,
      distributionMethod,
    });

    if (!file || !managerId || !candidateIds.length) {
      console.log("----[3.b] Missing required fields.");
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    if (!file.name?.endsWith(".csv") && file.type !== "text/csv") {
      console.log("----[3.c] Invalid CSV file format.", { fileType: file.type });
      return NextResponse.json({ message: "Invalid file format" }, { status: 400 });
    }

    const fileContent = await file.text();
    if (!fileContent.trim()) {
      console.log("----[3.d] CSV file is empty.");
      return NextResponse.json({ message: "CSV file is empty" }, { status: 400 });
    }
    console.log("----[3.e] File content loaded, size:", fileContent.length);

    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (h) => h.trim(),
      transform: (v) => (typeof v === "string" ? v.trim() : v),
    });

    if (parsed.errors.length > 0) {
      console.log("----[3.f] CSV parse errors:", parsed.errors);
      return NextResponse.json(
        { message: "CSV parsing error", errors: parsed.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    // Get header mapping to canonical field names
    const csvHeaders = Object.keys(parsed.data[0] || {});
    const FIELD_HEADER_MAP = getFieldHeaderMap(csvHeaders, FIELD_ALIASES);

    if (!Object.keys(FIELD_HEADER_MAP).length) {
      console.log("----[3.g] No matching name/email/phone columns present.");
      return NextResponse.json({
        message: "CSV must contain at least one of Name, Email, or Phone.",
      }, { status: 400 });
    }
    console.log("[3.h] Mapped header keys:", FIELD_HEADER_MAP);

    // Valid rows must have at least one of our standardized fields present
    const validRows = [];
    for (const row of parsed.data) {
      // only check rows with any value at all
      if (!Object.values(row).some(v => v !== "" && v != null)) continue;
      const std = getRowStandardized(row, FIELD_HEADER_MAP);
      if (Object.values(std).some(v => (v ?? '').toString().trim() !== "")) {
        validRows.push({ ...row, ...std }); // merge so old fields survive
      }
    }

    if (!validRows.length) {
      console.log("----[3.i] No valid data rows.");
      return NextResponse.json({ message: "No valid rows with at least one of Name/Email/Phone" }, { status: 400 });
    }
    console.log("----[3.j] # valid rows:", validRows.length);

    // Save each data row
    const dataRecords = [];
    for (const [idx, row] of validRows.entries()) {
      // Collect additional fields (those not mapped as required/canonical)
      const additionalFields = new Map();
      Object.entries(row).forEach(([key, val]) => {
        if (!Object.values(FIELD_HEADER_MAP).includes(key) && val != null) {
          additionalFields.set(key, val);
        }
      });

      const newRecord = new dataModels({
        ...(row.full_name ? { fullName: row.full_name } : {}),
        ...(row.email     ? { email: row.email.toLowerCase() } : {}),
        ...(row.phone     ? { phone: row.phone } : {}),
        additionalFields,
      });

      const saved = await newRecord.save();
      dataRecords.push(saved);

      if (idx < 3)
        console.log(`----[4] Saved sample row #${idx + 1} (_id=${saved._id})`);
    }
    console.log("----[5] All data rows saved. Total records:", dataRecords.length);

    // Distribute data to candidates
    const chunks = [];
    const distributedDataIds = [];

    if (distributionMethod === "equal") {
      const per = Math.floor(dataRecords.length / candidateIds.length);
      const extra = dataRecords.length % candidateIds.length;
      let index = 0;
      console.log("----[6] Distribution method: Equal", { per, extra });

      candidateIds.forEach((id, i) => {
        const count = per + (i < extra ? 1 : 0);
        chunks.push({ id, data: dataRecords.slice(index, index + count) });
        index += count;
        console.log("----[6.a] Candidate", id, "gets", count, "rows");
      });
    } else {
      const shuffled = [...dataRecords].sort(() => 0.5 - Math.random());
      const per = Math.floor(shuffled.length / candidateIds.length);
      let index = 0;
      console.log("----[7] Distribution method: Randomized", { per });

      candidateIds.forEach((id, i) => {
        const count = per + (i < shuffled.length % candidateIds.length ? 1 : 0);
        chunks.push({ id, data: shuffled.slice(index, index + count) });
        index += count;
        console.log("----[7.a] Candidate", id, "gets", count, "rows (shuffled)");
      });
    }
    // Save distributed chunks
    for (const [i, chunk] of chunks.entries()) {
      const distRecord = new distributedDonorData({
        candidate: chunk.id,
        data: chunk.data.map((d) => d._id),
        distributedBy: managerId,
        time: new Date(),
      });

      const saved = await distRecord.save();
      distributedDataIds.push(saved._id);
      console.log(`----[8] Distributed chunk #${i + 1} to candidate ${chunk.id} (distDataId=${saved._id}, records=${chunk.data.length})`);
    }
    console.log("----[9] All distributed chunks saved. distributedDataIds:", distributedDataIds);

    // Save UploadFile with minimal fields as per schema
    const uploadFile = new uploadFileModels({
      fileName: file.name,
      distributedData: distributedDataIds,
      fileType: ".csv",
      fileSize: file.size,
      totalRows: validRows.length,
      totalColumns: csvHeaders.length,
      uploadedBy: managerId,
      manager: [managerId],
      candidates: candidateIds,
    });

    const savedUpload = await uploadFile.save();
    console.log("----[10] UploadFile saved (uploadFileId:", savedUpload._id + ")");

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
