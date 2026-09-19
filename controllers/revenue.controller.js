import Order from "../models/Order.model.js";

export const getRevenue = async (req, res) => {
  try {
    const now = new Date();
    const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const revenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          paidAt: { $exists: true, $ne: null },
        },
      },
      {
        $facet: {
          totalRevenue: [
            {
              $group: {
                _id: null,
                total: { $sum: "$totalPrice" },
              },
            },
          ],

          currentMonthRevenue: [
            {
              $match: {
                paidAt: {
                  $gte: startOfCurrentMonth,
                  $lt: new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    1
                  ),
                },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$totalPrice" },
              },
            },
          ],

          lastMonthRevenue: [
            {
              $match: {
                paidAt: {
                  $gte: startOfLastMonth,
                  $lt: startOfCurrentMonth,
                },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$totalPrice" },
              },
            },
          ],
        },
      },
    ]);

    const totalRevenue = revenue[0].totalRevenue[0]?.total || 0;
    const currentMonthRevenue = revenue[0].currentMonthRevenue[0]?.total || 0;
    const lastMonthRevenue = revenue[0].lastMonthRevenue[0]?.total || 0;
    const growth =
      lastMonthRevenue === 0
        ? 0
        : ((currentMonthRevenue - lastMonthRevenue) /
            lastMonthRevenue) *
          100;
    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        currentMonthRevenue,
        lastMonthRevenue,
        growth: Number(growth.toFixed(2)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting revenue",
      error: error.message,
    });
  }
};