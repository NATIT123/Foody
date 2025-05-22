import mongoose from "mongoose";

const PaymentTransactionSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  vnp_TxnRef: String,
  vnp_Amount: Number,
  vnp_BankCode: String,
  vnp_ResponseCode: String,
  vnp_TransactionStatus: {
    type: String,
    enum: ["pending", "success", "fail"],
    default: "pending",
  },
  vnp_PayDate: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PaymentTransaction", PaymentTransactionSchema);
