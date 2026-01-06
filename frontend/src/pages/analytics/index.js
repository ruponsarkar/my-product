import React, { useState, useEffect } from 'react'
import CategoryPieChart from './piechart'
import StockBarChart from './StockBarChart'

import { topSellingProducts, ordersByUser, paymentBreakdown, summary, netProfit, salesByDate, salesByHour } from '../../api/services/product/anakyticsApi';

export default function Analytics() {


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
        })
    }

    const handleOrdersByUser = () => {
        ordersByUser().then((res) => {
            setOrdersByUserData(res.data);
        })
    }

    const handlePaymentBreakdown = () => {
        paymentBreakdown().then((res) => {
            setPaymentBreakdownData(res.data);
        })
    }

    const handleSummary = () => {
        summary().then((res) => {
            setSummaryData(res.data);
        })
    }

    const handleNetProfit = () => {
        netProfit().then((res) => {
            setNetProfitData(res.data);
        })
    }

    const handleSalesByDate = () => {
        salesByDate(type).then((res) => {
            setSalesByDateData(res.data.data);
        })
    }

    const handleSalesByHour = () => {
        salesByHour().then((res) => {
            setSalesByHourData(res.data);
        })
    }


    useEffect(() => {
        handleTopSellingProducts();
        handleOrdersByUser();
        handlePaymentBreakdown();
        handleSummary();
        handleNetProfit();
        // handleSalesByDate();
        handleSalesByHour();
    }, [])

    useEffect(() => {
        handleSalesByDate();
    }, [type])




    return (
        <div className="container">

            <div>
                <div className="row mt-2">
                    <div className="col-md-6">

                        <div className="card p-3 text-center">
                            <b>Top product Stock Summary</b>

                            <StockBarChart 
                            data={topSellingProductsData.map((item) => ({ stockQty: item.product.stockQty, reorderLevel: item.product.reorderLevel, quantity: item.quantity, revenue: item.revenue, name: item.product.name }))} 
                            bars={[{ key: "stockQty", color: "#1976d2" }, { key: "reorderLevel", color: "#f50057" }]}
                            />

                        </div>
                    </div>
                    <div className="col-md-6">

                        <div className="card p-3 text-center">
                            <b>Net Profit Summary</b>
                            <div className='d-flex justify-content-center align-items-center'>
                                <CategoryPieChart data={[{ name: "Total Cost", value: netProfitData.cost }, { name: "Total Profit", value: netProfitData.revenue - netProfitData.cost }]} />

                            </div>
                        </div>
                    </div>


                    <div className="col-md-6">

                        <div className="card p-3 text-center">
                            <b>Last {type === 'daily' ? '7 days' : '12 months'} Sales</b>
                            <div className='text-end'>
                            <select name="type" className='border' value={type} onChange={(e) => setType(e.target.value)} id="">
                                <option value="daily" onClick={() => setType('daily')}>Weekly</option>
                                <option value="monthly" onClick={() => setType('monthly')}>Monthly</option>
                                {/* <option value="yearly" onClick={() => setType('yearly')}>Yearly</option> */}
                            </select>
                            </div>

                            <StockBarChart 
                            data={salesByDateData.map((item) => ({ name: item._id, Total: item.total }))} 
                            bars={[{ key: "Total", color: "#1976d2" }]}
                            />

                        </div>
                    </div>


                </div>

            </div>


        </div>
    )
}