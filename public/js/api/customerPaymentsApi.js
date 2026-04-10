export const getAllCustomerPayments = async () => 
{
    return await $.ajax(
        {
            url: "/api/customer-payments/",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const getAllCustomerPaymentsTotalAmount = async () => 
{
    return await $.ajax(
        {
            url: "/api/customer-payments/total-amount",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const getCustomerPaymentById = async (id) => 
{
    return await $.ajax(
        {
            url: `/api/customer-payments/${id}`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};