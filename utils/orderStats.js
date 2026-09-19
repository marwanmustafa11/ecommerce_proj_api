import Order from "../models/Order.model.js";

const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
];

//1) Orders By Status
export const getOrdersByStatus = async () => {
    const results = await Order.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            }
        }
    ]);
    const statusCounts = {};
    ORDER_STATUSES.forEach((status) => {
        statusCounts[status] = 0;
    });
    results.forEach((item) => {
        statusCounts[item._id] = item.count;
    });
    return statusCounts;
};
////////////////////////////////////////////////////
//2) Top 5 Best-Selling Products
export const getTopSellingProducts = async (limit = 5) => {
    const result = await Order.aggregate([
        { $match: { status: { $nin: ["cancelled", "returned"] } } },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                name: { $first: "$items.name" },
                image: { $first: "$items.image" },
                unitsSold: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
            },
        },

        { $sort: { unitsSold: -1 } },
        { $limit: limit },
    ]);

    return result;
}
/////////////////////////////////////////////////////
// 3) Daily Revenue - Last 7 Days
export const getDailyRevenueLast7Days = async () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);

    const result = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo },
                status: { $nin: ["cancelled", "returned"] },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" , timezone: "UTC" },
                },
                revenue: { $sum: "$totalPrice" },
                orderCount: { $sum: 1 },
            },
        },
    ]);

    const resultMap = {};
    result.forEach((item) => {
        resultMap[item._id] = item;
    });

    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setUTCDate(d.getUTCDate() + i);
        const dateKey = d.toISOString().split("T")[0];

        days.push({
            date: dateKey,
            revenue: resultMap[dateKey] ?.revenue || 0,
            orderCount: resultMap[dateKey] ?.orderCount || 0,
        });
    }

    return days;
};
//////////////////////////////////////////////////////
// 4) Recent Orders
export const getRecentOrders = async (limit = 5) => {
    const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("user status totalPrice items createdAt")
    .populate("user", "username email");

    return orders;
}