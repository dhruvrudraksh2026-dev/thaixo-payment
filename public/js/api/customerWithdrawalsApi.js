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
