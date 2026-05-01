import { Request, Response } from "express";
import { getTenantModels } from "../services/tenant.service";

// helper to generate ORDER ID like ORD0001
const generateOrderId = async (Order: any) => {
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
      paidAmount,
      credit,
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

    const { Order } = await getTenantModels(req);
    const order_id = await generateOrderId(Order);
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
      paidAmount: paidAmount || 0,
      credit: credit || 0,
      status: payment_type,
    });

    await order.save();

    // decrement stock
    await removeStock(items, req);

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
    const { Order } = await getTenantModels(req);
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const removeStock = async (items: any[], req: Request & { user?: any }) => {
  if (!items.length) return;
  const { Product } = await getTenantModels(req);

  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { stockQty: -item.quantity } }, // 🔥 atomic decrement
    },
  }));

  const bulkOps2 = items.map((item) => console.log("item", item));

  console.log("bulkOps", bulkOps);

  await Product.bulkWrite(bulkOps);
};
