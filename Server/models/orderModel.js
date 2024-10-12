import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dimensions: {
    width: Number,
    height: Number,
  },
  price: {
    type: Number,
    default: 25, // Fixed price for every image
  },
  paymentMethod: {
    type: String,
    enum: ["paypal", "card"], // Track if the payment was through PayPal or card
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  paymentId: {
    type: String, // Store PayPal payment ID or Stripe Payment Intent ID
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", OrderSchema);
