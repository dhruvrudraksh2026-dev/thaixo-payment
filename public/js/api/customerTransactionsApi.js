export const getCustomerTransactionMinutesById = async (id) => 
{
    return await $.ajax(
        {
            url: `/api/customer-transactions/${id}`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const getCustomerTransactionTotalMinutesById = async (id) => 
{
    return await $.ajax(
        {
            url: `/api/customer-transactions/total/${id}`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};