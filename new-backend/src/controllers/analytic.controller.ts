import { Request, Response } from "express";
import { Types } from "mongoose";
import { getTenantModels } from "../services/tenant.service";

type AuthenticatedRequest = Request & { user?: any };
type DashboardRange = "daily" | "monthly";

const buildUserMatch = (req: AuthenticatedRequest) => {
  if (req.user?.role === "admin") {
    return {};
  }

  const userId = req.user?.id || req.user?._id;
  if (!userId || !Types.ObjectId.isValid(String(userId))) {
    return { user: userId };
  }

  return { user: new Types.ObjectId(String(userId)) };
};

const getRangeConfig = (type: DashboardRange) => {
  const now = new Date();
  const start = new Date(now);
  const buckets: Array<{ key: string; label: string }> = [];

  if (type === "monthly") {
    start.setMonth(now.getMonth() - 11, 1);
    start.setHours(0, 0, 0, 0);

    for (let index = 0; index < 12; index += 1) {
      const date = new Date(start);
      date.setMonth(start.getMonth() + index);

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });

      buckets.push({ key, label });
    }

    return {
      type,
      from: start,
      to: now,
      format: "%Y-%m",
      buckets,
    };
  }

  start.setDate(now.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    const label = date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    buckets.push({ key, label });
  }

  return {
    type,
    from: start,
    to: now,
    format: "%Y-%m-%d",
    buckets,
  };
};

const getTodayRange = () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

const normalizeRangeType = (value: unknown): DashboardRange => {
  return value === "monthly" ? "monthly" : "daily";
};

export const totalSalesSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { Order } = await getTenantModels(req);

    const result = await Order.aggregate([
      { $match: buildUserMatch(req) },
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};

export const salesByDate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { Order } = await getTenantModels(req);
    const range = getRangeConfig(normalizeRangeType(req.query.type));

    const data = await Order.aggregate([
      {
        $match: {
          ...buildUserMatch(req),
          createdAt: {
            $gte: range.from,
            $lte: range.to,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: range.format,
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
      type: range.type,
      from: range.from,
      to: range.to,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sales by date" });
  }
};

export const paymentBreakdown = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { Order } = await getTenantModels(req);
    const data = await Order.aggregate([
      { $match: buildUserMatch(req) },
      {
        $group: {
          _id: "$payment_type",
          orders: { $sum: 1 },
          amount: { $sum: "$total" },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment breakdown" });
  }
};

export const topSellingProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { Order } = await getTenantModels(req);
    const limit = Number(req.query.limit) || 10;

    const data = await Order.aggregate([
      { $match: buildUserMatch(req) },
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
      { $sort: { quantity: -1, revenue: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top products" });
  }
};

export const netProfit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { Order } = await getTenantModels(req);
    const data = await Order.aggregate([
      { $match: buildUserMatch(req) },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
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
              $multiply: ["$items.quantity", { $ifNull: ["$product.costPrice", 0] }],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          profit: { $subtract: ["$revenue", "$cost"] },
          revenue: 1,
          cost: 1,
        },
      },
    ]);

    res.json(data[0] || { revenue: 0, cost: 0, profit: 0 });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate profit" });
  }
};

export const hourlySales = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { Order } = await getTenantModels(req);
    const { startOfDay, endOfDay } = getTodayRange();

    const rawData = await Order.aggregate([
      {
        $match: {
          ...buildUserMatch(req),
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          total: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const fullDayData = Array.from({ length: 24 }, (_, hour) => {
      const found = rawData.find((entry) => entry._id === hour);
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hourly sales" });
  }
};

export const ordersByUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { Order } = await getTenantModels(req);
    const data = await Order.aggregate([
      { $match: buildUserMatch(req) },
      {
        $group: {
          _id: "$user",
          orders: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
      { $sort: { total: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders by user" });
  }
};

export const customReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { Order } = await getTenantModels(req);
    const { from, to, payment_type, status } = req.body;

    const match: any = buildUserMatch(req);

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
  } catch (error) {
    res.status(500).json({ message: "Failed to generate report" });
  }
};

export const dashboardOverview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { Order, Product } = await getTenantModels(req);
    const userMatch = buildUserMatch(req);
    const range = getRangeConfig(normalizeRangeType(req.query.type));
    const { startOfDay, endOfDay } = getTodayRange();

    const [
      totalsResult,
      todayResult,
      salesTrendRaw,
      paymentRaw,
      topProductsRaw,
      marginResult,
      hourlyRaw,
      teamRaw,
      lowStockRaw,
    ] = await Promise.all([
      Order.aggregate([
        { $match: userMatch },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
            totalCollected: { $sum: "$paidAmount" },
            outstandingCredit: { $sum: "$credit" },
            totalDiscount: { $sum: "$discount" },
            totalTax: { $sum: "$tax" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            ...userMatch,
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
        {
          $group: {
            _id: null,
            todayRevenue: { $sum: "$total" },
            todayOrders: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            ...userMatch,
            createdAt: {
              $gte: range.from,
              $lte: range.to,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: range.format,
                date: "$createdAt",
              },
            },
            revenue: { $sum: "$total" },
            collected: { $sum: "$paidAmount" },
            credit: { $sum: "$credit" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: userMatch },
        {
          $group: {
            _id: "$payment_type",
            orders: { $sum: 1 },
            amount: { $sum: "$total" },
          },
        },
        { $sort: { amount: -1 } },
      ]),
      Order.aggregate([
        { $match: userMatch },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            quantity: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          },
        },
        { $sort: { quantity: -1, revenue: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]),
      Order.aggregate([
        { $match: userMatch },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
            cost: {
              $sum: {
                $multiply: ["$items.quantity", { $ifNull: ["$product.costPrice", 0] }],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            revenue: 1,
            cost: 1,
            grossProfit: { $subtract: ["$revenue", "$cost"] },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            ...userMatch,
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: userMatch },
        {
          $group: {
            _id: "$user",
            orders: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]),
      Product.find(
        {
          isActive: true,
          $expr: {
            $lte: ["$stockQty", { $ifNull: ["$reorderLevel", 0] }],
          },
        },
        {
          name: 1,
          sku: 1,
          stockQty: 1,
          reorderLevel: 1,
          sellingPrice: 1,
        }
      )
        .sort({ stockQty: 1, updatedAt: -1 })
        .limit(6)
        .lean(),
    ]);

    const totals = totalsResult[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      totalCollected: 0,
      outstandingCredit: 0,
      totalDiscount: 0,
      totalTax: 0,
    };
    const today = todayResult[0] || { todayRevenue: 0, todayOrders: 0 };
    const margin = marginResult[0] || { revenue: 0, cost: 0, grossProfit: 0 };

    const averageOrderValue =
      totals.totalOrders > 0 ? totals.totalRevenue / totals.totalOrders : 0;
    const profitMargin =
      margin.revenue > 0 ? (margin.grossProfit / margin.revenue) * 100 : 0;

    const trendMap = new Map(salesTrendRaw.map((entry) => [entry._id, entry]));
    const salesTrend = range.buckets.map((bucket) => {
      const entry = trendMap.get(bucket.key);
      return {
        key: bucket.key,
        label: bucket.label,
        revenue: entry?.revenue || 0,
        collected: entry?.collected || 0,
        credit: entry?.credit || 0,
        orders: entry?.orders || 0,
      };
    });

    const totalPaymentAmount = paymentRaw.reduce(
      (sum, entry) => sum + Number(entry.amount || 0),
      0
    );
    const paymentBreakdownData = paymentRaw.map((entry) => ({
      key: entry._id || "unknown",
      name: entry._id || "unknown",
      orders: entry.orders || 0,
      amount: entry.amount || 0,
      share:
        totalPaymentAmount > 0
          ? Number((((entry.amount || 0) / totalPaymentAmount) * 100).toFixed(2))
          : 0,
    }));

    const topProducts = topProductsRaw.map((entry) => ({
      id: entry._id,
      name: entry.product?.name || "Unknown product",
      sku: entry.product?.sku || "",
      quantity: entry.quantity || 0,
      revenue: entry.revenue || 0,
    }));

    const hourlyMap = new Map(hourlyRaw.map((entry) => [entry._id, entry]));
    const hourlySalesData = Array.from({ length: 24 }, (_, hour) => {
      const entry = hourlyMap.get(hour);
      return {
        hour,
        label: `${String(hour).padStart(2, "0")}:00`,
        revenue: entry?.revenue || 0,
        orders: entry?.orders || 0,
      };
    });

    const ordersByUserData = teamRaw.map((entry) => ({
      id: entry._id,
      name: entry.user?.name || "Unassigned",
      orders: entry.orders || 0,
      revenue: entry.revenue || 0,
    }));

    const lowStockProducts = lowStockRaw.map((product: any) => ({
      id: product._id,
      name: product.name,
      sku: product.sku || "",
      stockQty: product.stockQty || 0,
      reorderLevel: product.reorderLevel || 0,
      reorderGap: Math.max((product.reorderLevel || 0) - (product.stockQty || 0), 0),
      sellingPrice: product.sellingPrice || 0,
    }));

    res.json({
      range: {
        type: range.type,
        from: range.from,
        to: range.to,
      },
      summary: {
        totalRevenue: totals.totalRevenue,
        totalOrders: totals.totalOrders,
        totalCollected: totals.totalCollected,
        outstandingCredit: totals.outstandingCredit,
        totalDiscount: totals.totalDiscount,
        totalTax: totals.totalTax,
        averageOrderValue,
        grossProfit: margin.grossProfit,
        profitMargin,
        todayRevenue: today.todayRevenue,
        todayOrders: today.todayOrders,
      },
      salesTrend,
      paymentBreakdown: paymentBreakdownData,
      topProducts,
      hourlySales: hourlySalesData,
      ordersByUser: ordersByUserData,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard overview" });
  }
};
