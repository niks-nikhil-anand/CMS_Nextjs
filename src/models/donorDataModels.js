import mongoose, { Schema } from "mongoose";

const donorDataSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[1-9]\d{7,14}$/, "Please enter a valid phone number"],
    },
    uploadFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UploadFile",
      required: true,
    },
    additionalFields: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
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

// Virtual to return all fields in a flattened format
donorDataSchema.virtual("allFields").get(function () {
  return {
    fullName: this.fullName,
    email: this.email,
    phone: this.phone,
    source: this.source,
    ...Object.fromEntries(this.additionalFields || {}),
  };
});

// Export model
export default mongoose.models.DonorData ||
  mongoose.model("DonorData", donorDataSchema);
