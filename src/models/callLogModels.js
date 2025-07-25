import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Data",
      required: true,
    },
    callDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CallDetails",
      required: true,
    },
    distributedData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DistributedData",
      required: true,
    },
    time: {},
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CallLog ||
  mongoose.model("CallLog", callLogSchema);
