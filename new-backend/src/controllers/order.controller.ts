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
      order_from,
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
      order_from: order_from || "POS",
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

const parsePositiveInt = (value: any, defaultValue: number) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return defaultValue;
  }
  return parsed;
};

export const getOrders = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const { Order } = await getTenantModels(req);
    const { startDate, endDate, paymentType, user: userId, credit, page, limit } = req.query;

    const query: any = {};
    const isAdmin = req.user?.role === "admin";

    if (isAdmin) {
      if (userId && typeof userId === "string") {
        query.user = userId;
      }
    } else {
      query.user = req.user.id;
    }

    if (typeof paymentType === "string") {
      if (paymentType === "online") {
        query.payment_type = "online";
      } else if (paymentType === "offline") {
        query.payment_type = "cash";
      } else if (paymentType === "credit") {
        query.payment_type = "credit";
      }
    }

    if (typeof credit === "string" && credit.toLowerCase() === "true") {
      query.credit = { $gt: 0 };
    }

    if (typeof startDate === "string" || typeof endDate === "string") {
      query.createdAt = {};
      if (typeof startDate === "string" && startDate) {
        const begin = new Date(startDate);
        if (!Number.isNaN(begin.getTime())) {
          query.createdAt.$gte = begin;
        }
      }
      if (typeof endDate === "string" && endDate) {
        const end = new Date(endDate);
        if (!Number.isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          query.createdAt.$lte = end;
        }
      }
      if (Object.keys(query.createdAt).length === 0) {
        delete query.createdAt;
      }
    }

    const pageNumber = parsePositiveInt(page, 1);
    const pageSize = parsePositiveInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email role")
      .populate("client", "name mobile email addressLine1 addressLine2 city")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      data: orders,
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getMyOrders = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const { Order } = await getTenantModels(req);
    const { page, limit } = req.query;

    const pageNumber = parsePositiveInt(page, 1);
    const pageSize = parsePositiveInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;
    const query = { user: req.user.id };

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("items.product")
      .populate("user", "name email role")
      .populate("client", "name mobile email addressLine1 addressLine2 city")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      data: orders,
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
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
