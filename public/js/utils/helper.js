export const showAlert = (message) => 
{
    $('#message').text(message);
    $('#alertModal').modal('show');
}
export const hideAlert = () => 
{
    $('#message').text('');
    $('#alertModal').modal('hide');
}
export const checkAndExecute = (response, func) =>
{
    try 
    {
        if (response.loginRequired)
        {
            window.location.href = '/login';
        }
        if (!response.success)
        {
            showAlert(response.message);
        }
        else
        {
            func();
        }
    }
    catch (error) 
    {
        console.error(error);
        showAlert("Some Unexpected Browser Error Occured");
    }
}
export const safeJSONParse = (value, defaultValue = []) =>
{
    try
    {
        if (!value) return defaultValue;

        if (typeof value === "string")
        {
            let parsed = JSON.parse(value);

            if (typeof parsed === "string")
            {
                parsed = JSON.parse(parsed);
            }

            return parsed;
        }

        return value;
    } catch (err)
    {
        console.error("safeJSONParse error:", err);
        return defaultValue;
    }
};
