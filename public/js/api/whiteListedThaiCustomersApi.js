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