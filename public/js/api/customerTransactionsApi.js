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

export const addCustomerTransaction = async (formData) =>
{
    return $.ajax(
        {
            url: "/api/customer-transaction",
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

export const editCustomerTransaction = async (formData) =>
{
    return $.ajax(
        {
            url: "/api/customer-transaction",
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

export const getCustomerTransactionByCustomerIdAndTimestamp = async (data) =>
{
    return $.ajax({
        url: '/api/customer-transaction',
        method: 'GET',
        data,
        processData: false,
        contentType: false
    });

}