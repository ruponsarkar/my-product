import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model("Order", orderSchema);
