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