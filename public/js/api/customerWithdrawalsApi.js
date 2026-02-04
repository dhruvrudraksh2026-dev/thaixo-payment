export const getAllCustomerWithdrawals = async () => 
{
    return await $.ajax(
        {
            url: `/api/customer-withdrawals`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const getCustomerWithdrawalsById = async (id) => 
{
    return await $.ajax(
        {
            url: `/api/customer-withdrawal/${id}`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const getCustomerWithdrawalsByCustomerId = async (id) => 
{
    return await $.ajax(
        {
            url: `/api/customer-withdrawals/${id}/withdrawals`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const getCustomerWithdrawalsByDateRangeByCustomerId = async (data) => 
{
    return await $.ajax(
        {
            url: `/api/customer-withdrawals/${data.id}/withdrawals/by-date-range?${data.params}`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const getCustomerWithdrawalsTotalAmountByDateRangeByCustomerId = async (data) => 
{
    return await $.ajax(
        {
            url: `/api/customer-withdrawals/${data.id}/withdrawals/total-by-date-range?${data.params}`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const addCustomerWithdrawal = async (formData) =>
{
    return $.ajax(
        {
            url: "/api/customer-withdrawal",
            method: "POST",
            headers:
            {
                Authorization: Cookies.get("token")
            },
            data: formData,
            processData: false,
            contentType: false
        });
}

export const editCustomerWithdrawal = async (formData) =>
{
    return $.ajax(
        {
            url: "/api/customer-withdrawal",
            method: "PUT",
            headers:
            {
                Authorization: Cookies.get("token")
            },
            data: formData,
            processData: false,
            contentType: false
        });
}

export const deleteCustomerWithdrawal = async (id) =>
{
    return $.ajax(
        {
            url: `/api/customer-withdrawal/${id}`,
            method: "DELETE",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
}
