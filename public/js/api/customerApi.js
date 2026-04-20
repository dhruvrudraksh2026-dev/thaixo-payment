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

// For Creator And Non Creator Customers
// --------------------------
// For Non Creator
// --------------------------
export const getNonCreatorThaiCustomers = async () => 
{
    return await $.ajax(
        {
            url: "/api/customers/thai/non-creator",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

// --------------------------
// For Creator
// --------------------------
export const getCreatorThaiCustomers = async () => 
{
    return await $.ajax(
        {
            url: "/api/customers/thai/creator",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

// --------------------------
// Customer Legal Details Verification
// --------------------------
export const verifyCustomerLegalDetailsById = async (id) => 
{
    return await $.ajax(
        {
            url: `/api/customer/legal-details/approve/${id}`,
            method: "PATCH",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const removeCustomerLegalDetailsById = async (id) => 
{
    return await $.ajax(
        {
            url: `/api/customer/legal-details/remove/${id}`,
            method: "PATCH",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const unverifyCustomerLegalDetailsById = async (id) => 
{
    return await $.ajax(
        {
            url: `/api/customer/legal-details/reject/${id}`,
            method: "PATCH",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

// --------------------------
// For Pending Customer Legal Details Verification
// --------------------------
export const getPendingLegalDetailsVerificationThaiCustomers = async () => 
{
    return await $.ajax(
        {
            url: "/api/customers/thai/pending-legal-details-verification",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};
