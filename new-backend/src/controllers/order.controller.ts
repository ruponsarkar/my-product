import { Request, Response } from "express";
import Order from "../models/order.model";

export const createOrder = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { items, total } = req.body;
    const order = new Order({
      user: req.user.id,
      items,
      total,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getMyOrders = async (req: Request & { user?: any }, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ errorr: err });
  }
};
