import { login } from "../api/LoginApi.js";
import { checkAndExecute } from "../utils/helper.js";

export const setUpLoginHandlers = () =>
{
    $('#login-form').on('submit', handleLogin);
}
async function handleLogin(e)
{
    e.preventDefault();
    const formData = new FormData(this);
    const response = await login(formData);
    checkAndExecute(response, () =>
    {
        window.location.href = "/dashboard";
    })
}
