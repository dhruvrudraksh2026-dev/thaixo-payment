export const toggleWhiteListedById = async (id) =>
{
    return await $.ajax(
        {
            url: `/api/customer/${id}/toggle-white-listed`,
            method: "PATCH",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
}

export const updateGeneratedOtpById = async (id) =>
{
    return await $.ajax(
        {
            url: `/api/customer/${id}/generate-otp`,
            method: "POST",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        }
    );
}

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

export const getCustomerTransactionsTotalAmountById = async (id) => 
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

export const getCustomerEarningsTotalAmountById = async (id) =>
{
    return await $.ajax(
        {
            url: `/api/customer-transaction/${id}/earnings/total`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        }
    );
}

export const getCustomerEarningsTotalAmountByDateRange = async (data) =>
{
    return await $.ajax({
        url: `/api/customer-transaction/${data.id}/earnings/total-by-date-range?${data.params}`,
        method: "GET",
        headers: {
            Authorization: Cookies.get("token")
        }
    });
}

export const getCustomerTransactionsByIdAndDateRange = async (data) =>
{
    return await $.ajax({
        url: `/api/customer-transactions/${data.id}/earnings?${data.params}`,
        method: "GET",
        headers: {
            Authorization: Cookies.get("token")
        }
    });
}