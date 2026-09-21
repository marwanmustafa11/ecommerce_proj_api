import User from "../models/User.model.js";
export const getTotalCustomers = async () => {

    const result = await User.aggregate([
    {
     $match: {
       role: "customer"}
    },

    {
        $count: "totalCustomers"
    }
    ]);
   const totalCustomers = result[0]?.totalCustomers || 0;
    return totalCustomers;
};