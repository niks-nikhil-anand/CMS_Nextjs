import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+\@.+\..+/, "Please provide a valid email address"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["Manager", "SuperAdmin", "Viewer", "Candidate"],
    },
    permissions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Blocked", "Pending", "inReview", "Active"],
      default: "inReview",
    },
    isToken: {
      type: String,
      default: "",
    },
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    callAttempted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Data",
      },
    ],
    scheduledFollowUp: [
      {
        dataId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Data",
        },
        followUpDate: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
