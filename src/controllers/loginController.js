import { validateEmail } from "../helpers/Validations.js";
import Response from "../helpers/response.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
class LoginController 
{
    static validEmail = "admin@gmail.com";
    static validPassword = "$2a$05$l1PjOpxZL7B3I2d6RVKGo.z57PTunx8SGIpbK/DQmkcxlvIYPTtS2";

    static login = async (req, res, next) =>
    {
        const data = req.body;
        if (!data.email && !validateEmail(data.email))
        {
            return res.json(Response.failure('Please Enter Email Correctly'));
        }

        if (!data.password)
        {
            return res.json(Response.failure('Please Enter Password'));
        }

        if (data.email != this.validEmail)
        {
            return res.json(Response.failure('Invalid Credentials'));
        }

        const user = {
            name: "Super Admin",
            email: this.validEmail,
            password: this.validPassword
        }

        if (!user)
        {
            return res.json(Response.failure("Account Does Not Exists"));
        }

        if (!bcrypt.compareSync(data.password, user.password))
        {
            return res.json(Response.failure("Invalid Credentials"));
        }

        const payload = {
            email: user.email,
            name: user.name,
            account: user.name
        };

        const jwtToken = jwt.sign(payload, 'key@123', { expiresIn: "1h" });
        res.cookie('token', jwtToken);
        return res.json(Response.success("Logged In Successfully", { 'token': jwtToken }));
    }
}

export default LoginController;