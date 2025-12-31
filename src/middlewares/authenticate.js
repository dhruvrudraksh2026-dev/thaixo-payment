import jwt from 'jsonwebtoken';
import resp from '../helpers/response.js';

export const WebAuthentication = (req, res, next) => 
{
    const authToken = req.cookies.token;

    if (!authToken)
    {
        return res.redirect("/login");
    }
    else
    {
        jwt.verify(authToken, "key@123", (err, decoded) => 
        {
            if (err)
            {
                return res.redirect("/login");
            }
            else
            {
                req.user = decoded;
                res.cookie("username", req.user.name);
                res.locals = req.user;
                return next();
            }
        });
    }
}

export const ApiAuthentication = (req, res, next) => 
{
    const authToken = req.headers.authorization;

    if (!authToken)
    {
        return res.json(resp.failure("Please login first", true));
    }
    else
    {
        jwt.verify(authToken, 'key@123', (err, decoded) =>
        {
            if (err)
            {
                return res.json(resp.failure('Please login', true));
            }
            else
            {
                req.user = decoded;
                res.locals = req.user;
                return next();
            }
        })
    }
}