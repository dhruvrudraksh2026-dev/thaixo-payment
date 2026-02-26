export const getThaiCustomers = async () => 
{
    return await $.ajax(
        {
            url: "/api/customers/thai",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const getCustomerById = async (id) => 
{
    return await $.ajax(
        {
            url: `/api/customer/${id}`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

// For Creator And Non Creator Customers
// --------------------------
// For Non Creator
// --------------------------
export const getNonCreatorThaiCustomers = async () => 
{
    return await $.ajax(
        {
            url: "/api/customers/thai/non-creator",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

// --------------------------
// For Creator
// --------------------------
export const getCreatorThaiCustomers = async () => 
{
    return await $.ajax(
        {
            url: "/api/customers/thai/creator",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};