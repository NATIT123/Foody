import mongoose, { Schema, model } from "mongoose";

const UserDetailSchema = new Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    password: String,
    image: String,
    address: String,
  },
  {
    timestamps: true,
  }
);

const UserModel = model("Users", UserDetailSchema);

export default UserModel;
