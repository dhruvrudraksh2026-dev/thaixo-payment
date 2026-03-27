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

export const MONTHS = [
    { id: 0, name: "January" },
    { id: 1, name: "February" },
    { id: 2, name: "March" },
    { id: 3, name: "April" },
    { id: 4, name: "May" },
    { id: 5, name: "June" },
    { id: 6, name: "July" },
    { id: 7, name: "August" },
    { id: 8, name: "September" },
    { id: 9, name: "October" },
    { id: 10, name: "November" },
    { id: 11, name: "December" }
];

export const formatExportData = (data, newlineChar) =>
{
    var $temp = $('<div>').html(data);
    if ($temp.find('div.mt-1').length > 0)
    {
        var lines = [];
        $temp.find('div.mt-1').each(function ()
        {
            var label = $(this).find('span.fw-semibold').text().trim();
            var value = $(this).find('span:not(.fw-semibold)').text().trim();
            if (label || value) lines.push(label + " " + value);
        });
        return lines.join(newlineChar);
    }
    return $temp.text().trim() || data.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}