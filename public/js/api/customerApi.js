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

// For White Listed And Non White Listed Customers
// --------------------------
// For Non White Listed
// --------------------------
export const getNonWhiteListedThaiCustomers = async () => 
{
    return await $.ajax(
        {
            url: "/api/customers/thai/non-white-listed",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

// --------------------------
// For White Listed
// --------------------------
export const getWhiteListedThaiCustomers = async () => 
{
    return await $.ajax(
        {
            url: "/api/customers/thai/white-listed",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};