import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  order_id: { type: String, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  cart: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      category: { type: String, required: true },
    },
  ],
  subtotal: { type: Number, required: true },
  discount: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: "Pay After Service" },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },

  // ✅ Task state
  is_approved: { type: Boolean, default: false },
  is_completed: { type: Boolean, default: false },
  is_canceled: { type: Boolean, default: false },
  status: { type: String, default: "Waiting for approval" },

  // ✅ Workers assigned
  assignedWorkers: [
    {
      workerId: { type: String, required: true },
      status: {
        type: String,
        enum: ["pending", "Accepted", "Rejected"],
        default: "pending",
      },
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

// 🔥 Pre-save hook to generate order_id
TaskSchema.pre("save", function (next) {
  if (!this.order_id) {
    let prefix = "OR"; // default
    const category = this.cart?.[0]?.category;

    if (category) {
      if (category.toLowerCase() === "makeup") prefix = "MU";
      else if (category.toLowerCase() === "decor") prefix = "ED";
      else if (category.toLowerCase() === "cleaning") prefix = "CL";
    }

    this.order_id = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
