import { Request, Response } from "express";
import Analytic from "../models/analytic.model";
import Product from "../models/product.model";
import Order from "../models/order.model";

export const totalSalesSummary = async (req: Request, res: Response) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$total" },
          totalCollected: { $sum: "$paidAmount" },
          totalCredit: { $sum: "$credit" },
          totalDiscount: { $sum: "$discount" },
          totalTax: { $sum: "$tax" },
        },
      },
    ]);

    res.json(
      result[0] || {
        totalOrders: 0,
        totalSales: 0,
        totalCollected: 0,
        totalCredit: 0,
        totalDiscount: 0,
        totalTax: 0,
      }
    );
  } catch {
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};


export const salesByDate = async (req: Request, res: Response) => {
  try {
    const { type = "daily" } = req.query;

    let startDate: Date;
    let format: string;

    const now = new Date();

    if (type === "monthly") {
      // 📅 Last 12 months
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 11); // include current month
      startDate.setDate(1); // start of month
      format = "%Y-%m";
    } else {
      // 📅 Last 7 days
      startDate = new Date();
      startDate.setDate(now.getDate() - 6); // include today
      format = "%Y-%m-%d";
    }

    const data = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: now,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format,
              date: "$createdAt",
            },
          },
          totalSales: { $sum: "$total" },
          totalCollected: { $sum: "$paidAmount" },
          totalCredit: { $sum: "$credit" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      type,
      from: startDate,
      to: now,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sales by date" });
  }
};

export const paymentBreakdown = async (req: Request, res: Response) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: "$payment_type",
          orders: { $sum: 1 },
          amount: { $sum: "$total" },
        },
      },
    ]);

    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch payment breakdown" });
  }
};

export const topSellingProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const data = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          quantity: { $sum: "$items.quantity" },
          revenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.price"],
            },
          },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch top products" });
  }
};

export const netProfit = async (req: Request, res: Response) => {
  try {
    const data = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.price"],
            },
          },
          cost: {
            $sum: {
              $multiply: ["$items.quantity", "$product.costPrice"],
            },
          },
          collected: {
            $sum: {
              $multiply: ["$paidAmount"],
            },
          },
          credit: {
            $sum: {
              $multiply: ["$credit"],
            },
          },

        },
      },
      {
        $project: {
          profit: { $subtract: ["$revenue", "$cost"] },
          revenue: 1,
          cost: 1,
          collected: 1,
          credit: 1
        },
      },
    ]);

    res.json(data[0] || {});
  } catch {
    res.status(500).json({ message: "Failed to calculate profit" });
  }
};

export const hourlySales = async (req: Request, res: Response) => {
  try {
    // 📅 Start & end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const rawData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: { $hour: "$createdAt" }, // 0–23
          total: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 🧠 Fill missing hours
    const fullDayData = Array.from({ length: 24 }, (_, hour) => {
      const found = rawData.find(d => d._id === hour);
      return {
        hour,
        total: found ? found.total : 0,
        orders: found ? found.orders : 0,
      };
    });

    res.json({
      date: startOfDay.toISOString().split("T")[0],
      data: fullDayData,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hourly sales" });
  }
};

export const ordersByUser = async (req: Request, res: Response) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          orders: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders by user" });
  }
};

export const customReport = async (req: Request, res: Response) => {
  // body structure should be
  // {
  //   "from": "2026-01-01",
  //   "to": "2026-01-31",
  //   "payment_type": "cash",
  //   "status": "completed"
  // }

  try {
    const { from, to, payment_type, status } = req.body;

    const match: any = {};

    if (from && to) {
      match.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    if (payment_type) match.payment_type = payment_type;
    if (status) match.status = status;

    const data = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
          discount: { $sum: "$discount" },
        },
      },
    ]);

    res.json(data[0] || {});
  } catch {
    res.status(500).json({ message: "Failed to generate report" });
  }
};
