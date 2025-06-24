import mongoose from "mongoose";

const uploadFileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: [".xlsx", ".xls", ".csv"],
      default: "csv",
      required: true,
    },
    fileSize: {
      type: Number, 
      required: true,
    },
    totalRows: {
      type: Number,
      required: true,
    },
    totalColumns: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    manager: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Export model
export default mongoose.models.UploadFile ||
  mongoose.model("UploadFile", uploadFileSchema);
