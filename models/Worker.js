import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema(
  {
    workerId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, unique: true, sparse: true }, // can be null
    password: { type: String, required: true },
    role: { type: String, enum: ["MU", "CL", "DC"], required: true },
    pushToken: { type: String, default: null }
  },
  { timestamps: true }
);

// ✅ Correct way
export default mongoose.models.Worker || mongoose.model("Worker", WorkerSchema);
