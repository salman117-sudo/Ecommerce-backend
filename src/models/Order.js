import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name: String,
  img: String,
  price: Number,
  size: String,
  color: String,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    items: [orderItemSchema],
    shipping: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
    },
    subtotal: Number,
    deliveryFee: Number,
    total: Number,
    stripePaymentIntentId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);