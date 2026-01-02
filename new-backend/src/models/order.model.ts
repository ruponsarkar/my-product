import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    // Who placed the order
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Unique readable order id (ORD123)
    order_id: {
      type: String,
      required: true,
      unique: true,
    },

    // Optional customer contact
    customer_phone: {
      type: String,
      default: null,
    },

    // Payment method
    payment_type: {
      type: String,
      enum: ["cash", "online"],
      required: true,
    },

    // Ordered items
    items: [
      {
        product: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number, // selling price at order time
          required: true,
        },
      },
    ],

    // Billing
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },

    // Order lifecycle
    status: {
      type: String,
      enum: ["ordered", "paid", "cancelled", "completed"],
      default: "ordered",
    },
  },
  {
    timestamps: true, // creates createdAt & updatedAt
  }
);

export default model("Order", orderSchema);
