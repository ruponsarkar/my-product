import React, { useState, useEffect } from "react";
import StockBarChart from "../analytics/StockBarChart";
import CategoryPieChart from "../analytics/piechart";
import {
  topSellingProducts,
  ordersByUser,
  paymentBreakdown,
  summary,
  netProfit,
  salesByDate,
  salesByHour,
} from "../../api/services/product/anakyticsApi";

export default function Summary() {
  const [topSellingProductsData, setTopSellingProductsData] = useState([]);
  const [ordersByUserData, setOrdersByUserData] = useState([]);
  const [paymentBreakdownData, setPaymentBreakdownData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [netProfitData, setNetProfitData] = useState([]);
  const [salesByDateData, setSalesByDateData] = useState([]);
  const [salesByHourData, setSalesByHourData] = useState([]);

  const [type, setType] = useState('daily'); //daily monthly

  const handleTopSellingProducts = () => {
    topSellingProducts().then((res) => {
      console.log("res.data.data", res.data);
      setTopSellingProductsData(res.data);
    });
  };

  const handleOrdersByUser = () => {
    ordersByUser().then((res) => {
      setOrdersByUserData(res.data);
    });
  };

  const handlePaymentBreakdown = () => {
    paymentBreakdown().then((res) => {
      setPaymentBreakdownData(res.data);
    });
  };

  const handleSummary = () => {
    summary().then((res) => {
      setSummaryData(res.data);
    });
  };

  const handleNetProfit = () => {
    netProfit().then((res) => {
      setNetProfitData(res.data);
    });
  };

  const handleSalesByDate = () => {
    salesByDate(type).then((res) => {
      setSalesByDateData(res.data);
    });
  };

  const handleSalesByHour = () => {
    salesByHour().then((res) => {
        console.log("handleSalesByHour", res.data);
      setSalesByHourData(res.data.data);
    });
  };

  useEffect(() => {
    handleTopSellingProducts();
    handleOrdersByUser();
    handlePaymentBreakdown();
    handleSummary();
    handleNetProfit();
    handleSalesByDate();
    handleSalesByHour();
  }, []);

  const products = [
    {
      _id: "6951332777980631ccf56fc6",
      quantity: 20,
      revenue: 2400,
      product: {
        _id: "6951332777980631ccf56fc6",
        name: "Rupon Sarkar",
        description: "\u003Cp\u003Etest\u003C/p\u003E",
        slug: "rupon-sarkar-16",
        sku: "1237",
        barcode: "ABC-abc-1234",
        category: "Electronocs",
        brand: "Iphone",
        costPrice: 100,
        sellingPrice: 120,
        mrp: 140,
        stockQty: 20,
        reorderQty: 30,
        isActive: true,
        isFeatured: false,
        attributes: {
          color: ["blue"],
          size: ["s"],
        },
        ratingsAverage: 0,
        ratingsCount: 0,
        images: [
          {
            url: "/uploads/1766929209309-910940933.jpeg",
            attributes: {
              color: ["blue"],
            },
          },
        ],
        createdAt: "2025-12-28T13:39:51.430Z",
        updatedAt: "2025-12-28T13:40:09.321Z",
        __v: 0,
      },
    },
    {
      _id: "68d96b6409a245e66bd29c45",
      quantity: 20,
      revenue: 2400,
      product: {
        _id: "68d96b6409a245e66bd29c45",
        name: "Rupon Sarkar",
        description: "\u003Cp\u003ETest\u003C/p\u003E",
        slug: "rupon-sarkar-4",
        sku: "123",
        category: "Electronocs",
        brand: "Iphone",
        costPrice: 10,
        sellingPrice: 120,
        mrp: 140,
        discount: 10,
        tax: 10,
        stockQty: 110,
        reorderLevel: 120,
        reorderQty: 100,
        supplierName: "Rupon",
        supplierContact: "9098909890",
        purchaseDate: "2025-09-28T00:00:00.000Z",
        expiryDate: "2025-10-01T00:00:00.000Z",
        warranty: "2025-09-30T00:00:00.000Z",
        warehouse: "hojai",
        isActive: true,
        isFeatured: true,
        images: [],
        ratingsAverage: 0,
        ratingsCount: 0,
        attributes: [],
        createdAt: "2025-09-28T17:07:48.413Z",
        updatedAt: "2025-09-28T17:07:48.413Z",
        __v: 0,
      },
    },
    {
      _id: "6957ce7714c14a09039cd113",
      quantity: 18,
      revenue: 9000,
      product: {
        _id: "6957ce7714c14a09039cd113",
        name: "tesr rrr u",
        description: "\u003Cp\u003Etest rr u\u003C/p\u003E",
        slug: "tesr-rrr",
        sku: "ELE-PHO-000001",
        barcode: "ELE-PHO-000001",
        category: "Electronocs",
        brand: "Iphone",
        costPrice: 550,
        sellingPrice: 500,
        mrp: 890,
        stockQty: 991,
        reorderLevel: 309,
        reorderQty: 9009,
        isActive: true,
        isFeatured: false,
        ratingsAverage: 0,
        ratingsCount: 0,
        images: [
          {
            url: "/uploads/1767367826975-227443526.jpeg",
          },
          {
            url: "/uploads/1767367826977-831147724.jpg",
          },
          {
            url: "/uploads/1767367863243-901319269.JPG",
          },
        ],
        createdAt: "2026-01-02T13:56:07.145Z",
        updatedAt: "2026-01-03T07:31:40.324Z",
        __v: 2,
        attributes: {
          color: ["blue", "red"],
          size: ["m", "l"],
        },
        warehouse: "hojai",
      },
    },
    {
      _id: "6957eb9477b084922722d5a5",
      quantity: 12,
      revenue: 1200,
      product: {
        _id: "6957eb9477b084922722d5a5",
        name: "New product ",
        description: "\u003Cp\u003ENew product&nbsp;\u003C/p\u003E",
        slug: "new-product",
        sku: "ELE-PHO-000002",
        barcode: "ELE-PHO-000002",
        category: "Electronocs",
        brand: "Phone",
        costPrice: 80,
        sellingPrice: 100,
        mrp: 120,
        stockQty: 30,
        reorderLevel: 5,
        isActive: true,
        isFeatured: false,
        ratingsAverage: 0,
        ratingsCount: 0,
        images: [],
        createdAt: "2026-01-02T16:00:20.340Z",
        updatedAt: "2026-01-03T07:31:40.324Z",
        __v: 0,
      },
    },
    {
      _id: "6956a4ac14c14a09039ccfac",
      quantity: 3,
      revenue: 840,
      product: {
        _id: "6956a4ac14c14a09039ccfac",
        name: "MINORITY STRESSORS AND IDEATION AMONG GENDER ",
        description:
          "\u003Cp\u003EMINORITY STRESSORS AND SUICIDAL IDEATION AMONG GENDER AND SEXUAL MINORITIES IN CROSS RIVER STATE, NIGERIA: THE MEDIATING ROLE OF PERCEIVED \u003C/p\u003E",
        slug: "minority-stressors-and-suicidal-ideation-among-gender-and-sexual-minorities-in-cross-river-state-nigeria-the-mediating-role-of-perceived",
        sku: "BOT-MIL-000001",
        barcode: "BOT-MIL-000001",
        category: "Bottle",
        brand: "Milton",
        costPrice: 200,
        sellingPrice: 280,
        mrp: 320,
        stockQty: 100,
        reorderLevel: 10,
        isActive: true,
        isFeatured: false,
        ratingsAverage: 0,
        ratingsCount: 0,
        images: [
          {
            url: "/uploads/1767285932371-340202194.jpeg",
          },
        ],
        createdAt: "2026-01-01T16:45:32.328Z",
        updatedAt: "2026-01-01T17:20:38.825Z",
        __v: 0,
      },
    },
    {
      _id: "695656d8d2457d410c7b98c0",
      quantity: 1,
      revenue: 900,
      product: {
        _id: "695656d8d2457d410c7b98c0",
        name: "Water bottle",
        slug: "water-bottle",
        sku: "111",
        barcode: "111",
        category: "Bottle",
        brand: "Milton",
        costPrice: 890,
        sellingPrice: 900,
        mrp: 900,
        stockQty: 30,
        reorderLevel: 10,
        isActive: true,
        isFeatured: false,
        ratingsAverage: 0,
        ratingsCount: 0,
        images: [
          {
            url: "/uploads/1767266064494-969643274.jpg",
          },
          {
            url: "/uploads/1767266091996-983014838.jpg",
          },
          {
            url: "/uploads/1767266092004-421772648.jpg",
          },
        ],
        createdAt: "2026-01-01T11:13:28.672Z",
        updatedAt: "2026-01-01T11:14:52.025Z",
        __v: 0,
      },
    },
    {
      _id: "6951332777980631ccf56fc6",
      quantity: 20,
      revenue: 2400,
      product: {
        _id: "6951332777980631ccf56fc6",
        name: "Rupon Sarkar",
        description: "\u003Cp\u003Etest\u003C/p\u003E",
        slug: "rupon-sarkar-16",
        sku: "1237",
        barcode: "ABC-abc-1234",
        category: "Electronocs",
        brand: "Iphone",
        costPrice: 100,
        sellingPrice: 120,
        mrp: 140,
        stockQty: 20,
        reorderQty: 30,
        isActive: true,
        isFeatured: false,
        attributes: {
          color: ["blue"],
          size: ["s"],
        },
        ratingsAverage: 0,
        ratingsCount: 0,
        images: [
          {
            url: "/uploads/1766929209309-910940933.jpeg",
            attributes: {
              color: ["blue"],
            },
          },
        ],
        createdAt: "2025-12-28T13:39:51.430Z",
        updatedAt: "2025-12-28T13:40:09.321Z",
        __v: 0,
      },
    },
    {
      _id: "68d96b6409a245e66bd29c45",
      quantity: 20,
      revenue: 2400,
      product: {
        _id: "68d96b6409a245e66bd29c45",
        name: "Rupon Sarkar",
        description: "\u003Cp\u003ETest\u003C/p\u003E",
        slug: "rupon-sarkar-4",
        sku: "123",
        category: "Electronocs",
        brand: "Iphone",
        costPrice: 10,
        sellingPrice: 120,
        mrp: 140,
        discount: 10,
        tax: 10,
        stockQty: 110,
        reorderLevel: 120,
        reorderQty: 100,
        supplierName: "Rupon",
        supplierContact: "9098909890",
        purchaseDate: "2025-09-28T00:00:00.000Z",
        expiryDate: "2025-10-01T00:00:00.000Z",
        warranty: "2025-09-30T00:00:00.000Z",
        warehouse: "hojai",
        isActive: true,
        isFeatured: true,
        images: [],
        ratingsAverage: 0,
        ratingsCount: 0,
        attributes: [],
        createdAt: "2025-09-28T17:07:48.413Z",
        updatedAt: "2025-09-28T17:07:48.413Z",
        __v: 0,
      },
    },
    {
      _id: "6957ce7714c14a09039cd113",
      quantity: 18,
      revenue: 9000,
      product: {
        _id: "6957ce7714c14a09039cd113",
        name: "tesr rrr u",
        description: "\u003Cp\u003Etest rr u\u003C/p\u003E",
        slug: "tesr-rrr",
        sku: "ELE-PHO-000001",
        barcode: "ELE-PHO-000001",
        category: "Electronocs",
        brand: "Iphone",
        costPrice: 550,
        sellingPrice: 500,
        mrp: 890,
        stockQty: 991,
        reorderLevel: 309,
        reorderQty: 9009,
        isActive: true,
        isFeatured: false,
        ratingsAverage: 0,
        ratingsCount: 0,
        images: [
          {
            url: "/uploads/1767367826975-227443526.jpeg",
          },
          {
            url: "/uploads/1767367826977-831147724.jpg",
          },
          {
            url: "/uploads/1767367863243-901319269.JPG",
          },
        ],
        createdAt: "2026-01-02T13:56:07.145Z",
        updatedAt: "2026-01-03T07:31:40.324Z",
        __v: 2,
        attributes: {
          color: ["blue", "red"],
          size: ["m", "l"],
        },
        warehouse: "hojai",
      },
    },
    {
      _id: "6957ce7714c14a09039cd113",
      quantity: 18,
      revenue: 9000,
      product: {
        _id: "6957ce7714c14a09039cd113",
        name: "tesr rrr u",
        description: "\u003Cp\u003Etest rr u\u003C/p\u003E",
        slug: "tesr-rrr",
        sku: "ELE-PHO-000001",
        barcode: "ELE-PHO-000001",
        category: "Electronocs",
        brand: "Iphone",
        costPrice: 550,
        sellingPrice: 500,
        mrp: 890,
        stockQty: 991,
        reorderLevel: 309,
        reorderQty: 9009,
        isActive: true,
        isFeatured: false,
        ratingsAverage: 0,
        ratingsCount: 0,
        images: [
          {
            url: "/uploads/1767367826975-227443526.jpeg",
          },
          {
            url: "/uploads/1767367826977-831147724.jpg",
          },
          {
            url: "/uploads/1767367863243-901319269.JPG",
          },
        ],
        createdAt: "2026-01-02T13:56:07.145Z",
        updatedAt: "2026-01-03T07:31:40.324Z",
        __v: 2,
        attributes: {
          color: ["blue", "red"],
          size: ["m", "l"],
        },
        warehouse: "hojai",
      },
    },
  ];

  const netRevenue = {
    _id: null,
    revenue: 16740,
    cost: 14550,
    profit: 2190,
  };

//   const ordersByUser = [
//     {
//       _id: "68cedafc6ef775bf4ca76295",
//       orders: 12,
//       total: 16740,
//       user: {
//         _id: "68cedafc6ef775bf4ca76295",
//         name: "admin",
//         email: "admin@admin.com",
//         password:
//           "$2b$10$b9Vz8EV5sbmiRYPnB1zU6OE1nnU9krQ/tkwsc47gWkQ1ofSyQoEki",
//         role: "user",
//         createdAt: "2025-09-20T16:49:00.290Z",
//         updatedAt: "2025-09-20T16:49:00.290Z",
//         __v: 0,
//       },
//     },
//     {
//       _id: "68cedafc6ef775bf4ca76295",
//       orders: 12,
//       total: 16740,
//       user: {
//         _id: "68cedafc6ef775bf4ca76295",
//         name: "admin",
//         email: "admin@admin.com",
//         password:
//           "$2b$10$b9Vz8EV5sbmiRYPnB1zU6OE1nnU9krQ/tkwsc47gWkQ1ofSyQoEki",
//         role: "user",
//         createdAt: "2025-09-20T16:49:00.290Z",
//         updatedAt: "2025-09-20T16:49:00.290Z",
//         __v: 0,
//       },
//     },
//   ];

  return (
    <div className="container">
      <div>
        <div className="row mt-2">
          <div className="col-md-6">
            <div className="card p-3 text-center">
              <b>Top product Stock Summary</b>

              <StockBarChart
                data={topSellingProductsData.map((item) => ({
                  stockQty: item.product.stockQty,
                  reorderLevel: item.product.reorderLevel,
                  quantity: item.quantity,
                  revenue: item.revenue,
                  name: item.product.name,
                }))}
                bars={[
                  { key: "stockQty", color: "#1976d2" },
                  { key: "reorderLevel", color: "red" },
                ]}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 text-center">
              <b>Sales by hours</b>
              <div className="d-flex justify-content-center align-items-center">
                <CategoryPieChart
                //   data={[
                //     { name: "Total Cost", value: netProfitData.cost, color: "red" },
                //     {
                //       name: "Total Profit",
                //       value: netProfitData.revenue - netProfitData.cost,
                //     },
                //   ]}
                data={salesByHourData.map((item) => ({
                  name: item.hour,
                  value: item.total
                }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-2 py-3">
          <div>
            <b>Summary :</b>
          </div>

          <div className=" p-1">
            <div className="card">
              <div className="card-body">
                <div className="border-bottom">
                  <div className="small">
                    {" "}
                    <b> Total Orders </b> :{" "}
                  </div>
                  <div>{summaryData.totalOrders}</div>
                </div>

                <div className="border-bottom">
                  <div className="small">
                    {" "}
                    <b> Total Revenue </b> :{" "}
                  </div>
                  <div>{summaryData.totalRevenue}</div>
                </div>

                <div className="border-bottom">
                  <div className="small">
                    {" "}
                    <b> Total Discount </b> :{" "}
                  </div>
                  <div>{summaryData.totalDiscount}</div>
                </div>

                <div className="border-bottom">
                  <div className="small">
                    {" "}
                    <b> Total Tax </b> :{" "}
                  </div>
                  <div>{summaryData.totalTax}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 py-3">
          <div>
            <b>Top Products:</b>
          </div>

          <div className="p-1">
            <div className="card p-2">
              {topSellingProductsData.map((p, index) => (
                <div className="border-bottom p-2">
                  <div className="small">
                    {" "}
                    {index + 1}. {p.product.name}.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4 py-3">
          <div>
            <b>Orders by user:</b>
          </div>

          <div className="p-1">
            <div className="">
              {ordersByUserData.map((p, index) => (
                <div className="card p-2 mb-2">
                  <div className="border-bottom">
                    {" "}
                    <b>
                      {" "}
                      {index + 1}. {p.user.name}{" "}
                    </b>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="text-muted ">
                      <div>
                        <small>
                          {" "}
                          <b>Today Orders: </b> {p.orders}
                        </small>
                      </div>
                      <div>
                        <small>
                          {" "}
                          <b>Today revenue: </b> {p.total}
                        </small>
                      </div>
                    </div>
                    <div className="text-muted">
                      <div>
                        <small>
                          {" "}
                          <b> Total Orders: </b> {p.orders}
                        </small>
                      </div>
                      <div>
                        <small>
                          {" "}
                          <b> Total revenue: </b> {p.total}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-2 py-3">
          <div>
            <b>Payment breakdown :</b>
          </div>

          {paymentBreakdownData.map((p, index) => (
            <div className=" p-1">
              <div className="card">
                <div className="card-body">
                  <div className="small border-bottom">
                    {" "}
                    <b> {p._id} </b>{" "}
                  </div>
                  <div className="">Orders: {p.orders}</div>
                  <div className="">Amount: {p.amount}</div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
