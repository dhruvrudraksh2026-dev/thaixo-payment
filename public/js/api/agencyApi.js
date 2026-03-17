export const getAllAgency = async () => 
{
    return await $.ajax(
        {
            url: "/api/agencies",
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const getAgencyById = async (id) => 
{
    return await $.ajax(
        {
            url: `/api/agency/${id}`,
            method: "GET",
            headers:
            {
                Authorization: Cookies.get("token")
            }
        });
};

export const addAgency = async (formData) => 
{
    return await $.ajax(
        {
            url: "/api/agency",
            method: "POST",
            headers: {
                Authorization: Cookies.get("token")
            },
            data: formData,
            contentType: false,
            processData: false
        });
};

export const updateAgencyById = async (formData) => 
{
    return await $.ajax({
        url: `/api/agency`,
        method: "PUT",
        headers: {
            Authorization: Cookies.get("token")
        },
        data: formData,
        contentType: false,
        processData: false
    });
};

export const deleteAgencyById = async (id) => 
{
    return await $.ajax({
        url: `/api/agency/${id}`,
        method: "DELETE",
        headers: {
            Authorization: Cookies.get("token")
        }
    });
};