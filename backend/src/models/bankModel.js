import mongoose, { Schema, model } from "mongoose";
const BankDetailSchema = new Schema(
  {
    bank_code: {
      type: String,
      required: [true, "Please tell us your bankcode"],
    },
    bank_name: {
      type: String,
      required: [true, "Please tell us your bank name"],
    },
    logo_link: {
      type: String,
      default: true,
    },
    logo_link: {
      type: String,
      default: true,
    },
    bank_type: {
      type: String,
      default: true,
    },
    display_order: {
      type: String,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const BankModel = model("banks", BankDetailSchema);

export default BankModel;
