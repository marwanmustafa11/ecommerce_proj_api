import sendEmail from "./sendEmail.js";


const sendOrderConfirmationEmail = async (order) =>
{
    const to = order.user.email;
    const subject = `Order Confirmation - ${order._id}`;
    let text = `  Order Confirmation
                  Order ID: ${order._id}
                  Status: ${order.status}
                `;
    text += `\nItems:\n`;
    order.items.forEach((item) =>
    {
        text += `\nProduct: ${item.name}\n`;
        text += `Quantity: ${item.quantity} | Unit Price: ${item.price}\n`;
        text += `Subtotal: ${item.price * item.quantity}\n`;
    });
    text += ` Order Summary Subtotal: ${order.subtotal}
              Discount: ${order.discount || 0}
              Total: ${order.totalPrice}
            `;
    await sendEmail(to, subject, text);
};

const sendOrderStatusEmail = async (order) =>
{
    const to = order.user.email;
    const subject = `Order Status Update - ${order._id}`;
    const text = `
                  Order Status Update
                  Order ID: ${order._id}
                  New Status: ${order.status}
                  Your order status has been updated to: ${order.status}
                `;
    await sendEmail(to, subject, text);

}

export {
    sendOrderConfirmationEmail,
    sendOrderStatusEmail
};