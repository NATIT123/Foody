import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  productId: { type: String, required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: [true, "Please tell us your restaurantId"],
  },
  quantity: {
    type: Number,
    required: [true, "Please tell us your quantity"],
  },
  price: {
    type: Number,
    required: [true, "Please tell us your price"],
  },
});

export default mongoose.model("OrderItem", OrderItemSchema);
