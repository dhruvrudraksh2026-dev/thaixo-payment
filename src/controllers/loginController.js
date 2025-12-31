import { validateEmail } from "../helpers/Validations.js";
import Response from "../helpers/response.js";
import jwt from 'jsonwebtoken';
import db from "../../config/db.js";
import bcrypt from 'bcrypt'
class LoginController 
{
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
        const [rows] = await db.query(
            `SELECT u.id, u.name, u.email, u.password, u.userroleid, u.status, ur.permissions
                FROM user u 
                LEFT JOIN userrole ur ON u.userroleid = ur.id
                WHERE u.email = ?`,
            [data.email]
        );
        const user = rows[0];

        if (!user)
        {
            return res.json(Response.failure("Account Does Not Exists"));
        }

        if (user.status == 0)
        {
            return res.json(Response.failure("You Are Not An Active User"));
        }
        if (!bcrypt.compareSync(data.password, user.password))
        {
            return res.json(Response.failure("Invalid Credentials"));
        }


        if (typeof user.permissions == "string")
        {
            user.permissions = JSON.parse(user.permissions);
        }

        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            roleId: user.userroleid,
            permissions: user.permissions,
            account: user.name
        };

        const jwtToken = jwt.sign(payload, 'key@123', { expiresIn: "1h" });
        res.cookie('token', jwtToken);
        return res.json(Response.success("Logged In Successfully", { 'token': jwtToken }));
    }
}

export default LoginController;