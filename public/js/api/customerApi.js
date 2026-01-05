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