import { Request, Response } from "express";
import { Types } from "mongoose";
import { getTenantModels } from "../services/tenant.service";

type AuthenticatedRequest = Request & { user?: any };
type DashboardRange = "daily" | "weekly" | "monthly" | "custom";

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

const toDateAtStartOfDay = (value: unknown) => {
  if (!value || typeof value !== "string") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const toDateAtEndOfDay = (value: unknown) => {
  if (!value || typeof value !== "string") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(23, 59, 59, 999);
  return date;
};

const formatBucketKey = (date: Date, type: "daily" | "weekly" | "monthly") => {
  if (type === "monthly") {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  if (type === "weekly") {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const firstSunday = new Date(firstDayOfYear);
    firstSunday.setDate(firstDayOfYear.getDate() + ((7 - firstDayOfYear.getDay()) % 7));
    const week =
      date < firstSunday
        ? 0
        : Math.floor((date.getTime() - firstSunday.getTime()) / 604800000) + 1;
    return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const getRangeConfig = (type: DashboardRange, query: any = {}) => {
  const now = new Date();
  const start = new Date(now);
  const buckets: Array<{ key: string; label: string }> = [];

  if (type === "custom") {
    const from = toDateAtStartOfDay(query.from);
    const to = toDateAtEndOfDay(query.to);
    const validFrom = from || new Date(now);
    const validTo = to || now;
    if (!from) {
      validFrom.setDate(now.getDate() - 29);
      validFrom.setHours(0, 0, 0, 0);
    }

    const diffDays = Math.max(
      1,
      Math.ceil((validTo.getTime() - validFrom.getTime()) / 86400000) + 1
    );
    const bucketType: "daily" | "weekly" | "monthly" =
      diffDays > 120 ? "monthly" : diffDays > 45 ? "weekly" : "daily";
    const format =
      bucketType === "monthly" ? "%Y-%m" : bucketType === "weekly" ? "%Y-W%U" : "%Y-%m-%d";
    const cursor = new Date(validFrom);

    while (cursor <= validTo && buckets.length < 370) {
      buckets.push({
        key: formatBucketKey(cursor, bucketType),
        label:
          bucketType === "monthly"
            ? cursor.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
            : bucketType === "weekly"
              ? `Week ${formatBucketKey(cursor, "weekly").split("-W")[1]}`
              : cursor.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      });

      if (bucketType === "monthly") {
        cursor.setMonth(cursor.getMonth() + 1, 1);
      } else if (bucketType === "weekly") {
        cursor.setDate(cursor.getDate() + 7);
      } else {
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return {
      type,
      bucketType,
      from: validFrom,
      to: validTo,
      format,
      buckets,
    };
  }

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
      bucketType: "monthly",
      from: start,
      to: now,
      format: "%Y-%m",
      buckets,
    };
  }

  if (type === "weekly") {
    start.setDate(now.getDate() - 49);
    start.setHours(0, 0, 0, 0);

    for (let index = 0; index < 8; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index * 7);
      const key = formatBucketKey(date, "weekly");

      buckets.push({
        key,
        label: `Week ${key.split("-W")[1]}`,
      });
    }

    return {
      type,
      bucketType: "weekly",
      from: start,
      to: now,
      format: "%Y-W%U",
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
    bucketType: "daily",
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
  if (value === "weekly" || value === "monthly" || value === "custom") {
    return value;
  }
  return "daily";
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
    const range = getRangeConfig(normalizeRangeType(req.query.type), req.query);

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
    const range = getRangeConfig(normalizeRangeType(req.query.type), req.query);
    const { startOfDay, endOfDay } = getTodayRange();
    const rangeDuration = Math.max(1, range.to.getTime() - range.from.getTime());
    const previousFrom = new Date(range.from.getTime() - rangeDuration);
    const previousTo = new Date(range.from.getTime() - 1);
    const rangeMatch = {
      ...userMatch,
      createdAt: {
        $gte: range.from,
        $lte: range.to,
      },
    };

    const [
      totalsResult,
      rangeResult,
      previousRangeResult,
      todayResult,
      salesTrendRaw,
      paymentRaw,
      topProductsRaw,
      marginResult,
      hourlyRaw,
      teamRaw,
      lowStockRaw,
      statusRaw,
      sourceRaw,
      categoryRaw,
      inventoryResult,
      slowMovingRaw,
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
        { $match: rangeMatch },
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
              $gte: previousFrom,
              $lte: previousTo,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
            totalCollected: { $sum: "$paidAmount" },
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
        { $match: rangeMatch },
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
        { $match: rangeMatch },
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
        { $match: rangeMatch },
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
        { $match: rangeMatch },
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
        { $match: rangeMatch },
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
      Order.aggregate([
        { $match: rangeMatch },
        {
          $group: {
            _id: "$status",
            orders: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
        { $sort: { orders: -1 } },
      ]),
      Order.aggregate([
        { $match: rangeMatch },
        {
          $group: {
            _id: "$order_from",
            orders: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
        { $sort: { revenue: -1 } },
      ]),
      Order.aggregate([
        { $match: rangeMatch },
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
            _id: { $ifNull: ["$product.category", "Uncategorized"] },
            quantity: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 8 },
      ]),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            products: { $sum: 1 },
            unitsInStock: { $sum: "$stockQty" },
            inventoryValue: {
              $sum: {
                $multiply: [{ $ifNull: ["$stockQty", 0] }, { $ifNull: ["$costPrice", 0] }],
              },
            },
            retailValue: {
              $sum: {
                $multiply: [{ $ifNull: ["$stockQty", 0] }, { $ifNull: ["$sellingPrice", 0] }],
              },
            },
          },
        },
      ]),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: "orders",
            let: { productId: "$_id" },
            pipeline: [
              { $match: rangeMatch },
              { $unwind: "$items" },
              {
                $match: {
                  $expr: {
                    $eq: ["$items.product", "$$productId"],
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  quantity: { $sum: "$items.quantity" },
                },
              },
            ],
            as: "sales",
          },
        },
        {
          $addFields: {
            soldQuantity: { $ifNull: [{ $arrayElemAt: ["$sales.quantity", 0] }, 0] },
          },
        },
        { $sort: { soldQuantity: 1, stockQty: -1 } },
        { $limit: 8 },
        {
          $project: {
            name: 1,
            sku: 1,
            stockQty: 1,
            reorderLevel: 1,
            sellingPrice: 1,
            soldQuantity: 1,
          },
        },
      ]),
    ]);

    const lifetimeTotals = totalsResult[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      totalCollected: 0,
      outstandingCredit: 0,
      totalDiscount: 0,
      totalTax: 0,
    };
    const totals = rangeResult[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      totalCollected: 0,
      outstandingCredit: 0,
      totalDiscount: 0,
      totalTax: 0,
    };
    const previousTotals = previousRangeResult[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      totalCollected: 0,
    };
    const today = todayResult[0] || { todayRevenue: 0, todayOrders: 0 };
    const margin = marginResult[0] || { revenue: 0, cost: 0, grossProfit: 0 };

    const averageOrderValue =
      totals.totalOrders > 0 ? totals.totalRevenue / totals.totalOrders : 0;
    const profitMargin =
      margin.revenue > 0 ? (margin.grossProfit / margin.revenue) * 100 : 0;
    const growth = {
      revenue:
        previousTotals.totalRevenue > 0
          ? ((totals.totalRevenue - previousTotals.totalRevenue) / previousTotals.totalRevenue) * 100
          : totals.totalRevenue > 0
            ? 100
            : 0,
      orders:
        previousTotals.totalOrders > 0
          ? ((totals.totalOrders - previousTotals.totalOrders) / previousTotals.totalOrders) * 100
          : totals.totalOrders > 0
            ? 100
            : 0,
      collected:
        previousTotals.totalCollected > 0
          ? ((totals.totalCollected - previousTotals.totalCollected) / previousTotals.totalCollected) * 100
          : totals.totalCollected > 0
            ? 100
            : 0,
    };

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
    const statusBreakdown = statusRaw.map((entry) => ({
      key: entry._id || "unknown",
      name: entry._id || "unknown",
      orders: entry.orders || 0,
      revenue: entry.revenue || 0,
    }));
    const orderSourceBreakdown = sourceRaw.map((entry) => ({
      key: entry._id || "unknown",
      name: entry._id || "unknown",
      orders: entry.orders || 0,
      revenue: entry.revenue || 0,
    }));
    const categoryPerformance = categoryRaw.map((entry) => ({
      name: entry._id || "Uncategorized",
      quantity: entry.quantity || 0,
      revenue: entry.revenue || 0,
    }));
    const inventory = inventoryResult[0] || {
      products: 0,
      unitsInStock: 0,
      inventoryValue: 0,
      retailValue: 0,
    };
    const slowMovingProducts = slowMovingRaw.map((product: any) => ({
      id: product._id,
      name: product.name || "Unknown product",
      sku: product.sku || "",
      stockQty: product.stockQty || 0,
      reorderLevel: product.reorderLevel || 0,
      sellingPrice: product.sellingPrice || 0,
      soldQuantity: product.soldQuantity || 0,
    }));

    res.json({
      range: {
        type: range.type,
        bucketType: range.bucketType,
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
        growth,
        lifetimeRevenue: lifetimeTotals.totalRevenue,
        lifetimeOrders: lifetimeTotals.totalOrders,
      },
      salesTrend,
      paymentBreakdown: paymentBreakdownData,
      topProducts,
      hourlySales: hourlySalesData,
      ordersByUser: ordersByUserData,
      lowStockProducts,
      statusBreakdown,
      orderSourceBreakdown,
      categoryPerformance,
      inventory,
      slowMovingProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard overview" });
  }
};
