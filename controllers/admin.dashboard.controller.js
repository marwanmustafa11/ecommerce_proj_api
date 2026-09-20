import { getTotalCustomers } from "../utils/customerAnalytics.js"; 
import { getRevenueData } from "./revenue.controller.js";  
import {getOrdersByStatus,getTopSellingProducts,getDailyRevenueLast7Days,getRecentOrders,} from "../utils/orderStats.js";

  export const getDashboard = async (req, res) => {
   try {
    const [totalCustomers,revenueData,ordersByStatus,topSellingProducts,dailyRevenueLast7Days,recentOrders] = await Promise.all([
      getTotalCustomers(),          
      getRevenueData(),             
      getOrdersByStatus(),          
      getTopSellingProducts(5),   
      getDailyRevenueLast7Days(), 
      getRecentOrders(5),         
      ]);

     return res.status(200).json({
      success: true,
      data: {
        totalRevenue: revenueData.totalRevenue,
        currentMonthRevenue: revenueData.currentMonthRevenue,
        lastMonthRevenue: revenueData.lastMonthRevenue,
        growth: revenueData.growth,
        ordersByStatus,
        topSellingProducts,
        dailyRevenueLast7Days,
        recentOrders,
        totalCustomers,
      },
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting dashboard",
      error: error.message,
    });
  }
};