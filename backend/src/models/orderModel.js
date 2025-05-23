import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Please tell us your userId"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Please tell us your totalAmount"],
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    fullName: {
      type: String,
      required: [true, "Please tell us your fullName"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please tell us your phoneNumber"],
    },
    address: {
      type: String,
      required: [true, "Please tell us your address"],
    },
    orderItems: [
      {
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "restaurants",
          required: [true, "Please tell us your restaurantId"],
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "foods",
          required: [true, "Please tell us your foodId"],
        },
        quantity: {
          type: Number,
          required: [true, "Please tell us your quantity"],
        },
        price: {
          type: Number,
          required: [true, "Please tell us your price"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("orders", OrderSchema);
export default Order;
