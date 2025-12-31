export const login = async (FormData) =>
{
    return await $.ajax({
        url: `/api/login`,
        method: 'POST',
        data: FormData,
        contentType: false,
        processData: false
    });
}