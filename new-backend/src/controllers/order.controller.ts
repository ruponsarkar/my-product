import { Request, Response } from "express";
import Order from "../models/order.model";

// helper to generate ORDER ID like ORD0001
const generateOrderId = async () => {
  const count = await Order.countDocuments();
  return `ORD${String(count + 1).padStart(4, "0")}`;
};

export const createOrder = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const {
      items,
      subtotal,
      discount,
      tax,
      total,
      payment_type,
      customer_phone,
    } = req.body;

    // basic validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!payment_type) {
      return res.status(400).json({ message: "Payment type is required" });
    }

    const order_id = await generateOrderId();
    console.log("user ", req.user);

    const order = new Order({
      user: req.user.id,
      order_id,
      customer_phone: customer_phone || null,
      payment_type,
      items: items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price, // snapshot price
      })),
      subtotal,
      discount: discount || 0,
      tax: tax || 0,
      total,
      status: payment_type === "cash" ? "ordered" : "paid",
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getMyOrders = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
