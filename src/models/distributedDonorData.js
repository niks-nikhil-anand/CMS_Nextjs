import mongoose from "mongoose";

const distributedDataSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    data: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Data",
        required: true
      }
    ],
    distributedBy: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    time:{

    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.DistributedData ||
  mongoose.model("DistributedData", distributedDataSchema);
