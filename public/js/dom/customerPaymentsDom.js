const PAYMENT_STATUS = {
    CREATED: {
        label: "Created",
        badge: `<h6><span class="badge bg-warning text-dark" style="font-size: 14px;">Created</span></h6>`
    },
    SUCCESS: {
        label: "Success",
        badge: `<h6><span class="badge bg-success" style="font-size: 14px;">Success</span></h6>`
    },
    FAILED: {
        label: "Failed",
        badge: `<h6><span class="badge bg-danger" style="font-size: 14px;">Failed</span></h6>`
    }
};

export const renderCustomerPayments = (data, tableBody) => 
{
    tableBody.empty();
    data.forEach((customerPayment) => 
    {
        const paymentStatus = PAYMENT_STATUS[customerPayment.status]?.badge || PAYMENT_STATUS["CREATED"]?.badge;

        tableBody.append(`
            <tr data-id=${customerPayment.id}>
                <td>#${customerPayment.id}</td>
                <td>${`${customerPayment.customer_id} - ${customerPayment.customer_name}` || "N/A"}</td>
                <td>${customerPayment.razorpay_order_id || "N/A"}</td>
                <td>${customerPayment.receipt || "N/A"}</td>
                <td>${`${customerPayment.package_id} - ${customerPayment.package_name || "N/A"}` || "N/A"}</td>
                <td>${customerPayment.amount || "N/A"}</td>
                <td>${customerPayment.coins || "N/A"}</td>
                <td>${customerPayment.bonus_coins || "N/A"}</td>
                <td>${paymentStatus}</td>
                <td>${new Date(customerPayment.created_at).toLocaleString() || "N/A"}</td>                
            </tr>
        `);
    });
};

export const renderCustomerPaymentsTotalAmount = (data, element) => 
{
    element.empty();
    element.append(`
        <h5 class="text-center text-primary">Total Amount (Success): ₹${data.total_amount || "N/A"}</h5>
    `);
};