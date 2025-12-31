class Response
{

    static success = (message, data = null) =>
    {
        return {
            success: true,
            message: message,
            data: data
        };
    }

    static failure = (message, loginRequired = false) =>
    {
        return {
            success: false,
            loginRequired: loginRequired,
            message: message
        };
    }
}
export default Response;