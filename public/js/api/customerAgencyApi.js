export const getAgencyCustomers = async (agencyId) =>
{
    return await $.ajax(
        {
            url: `/api/agency/customers/${agencyId}`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
}