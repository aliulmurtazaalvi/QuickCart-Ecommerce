import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk user ID as _id
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imgURL: { type: String, required: true },
    cartItems: { type: Object, default: {} },
  },
  { minimize: false, timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
