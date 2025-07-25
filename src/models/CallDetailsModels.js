import mongoose from "mongoose";

const CallDetailsSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["connected", "not-connected"],
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "Busy in another call",
        "User disconnected the call",
        "Switch off",
        "Out of coverage/network issue",
        "Other reason",
        "Incorrect/invalid number",
        "Incoming calls not available",
        "Number not in use/does not exist/out of service",
        null,
      ],
    },
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
    customerInterested: Boolean,
    isScheduled: Boolean,
    followUpDate: String,
    donationAmount: String,
    callOutcome: String,
    remarks: String,
    doNotDisturb: Boolean,
    valuableCustomer: Boolean,
    appointmentScheduled: Boolean,
    callTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CallDetails ||
  mongoose.model("CallDetails", CallDetailsSchema);
