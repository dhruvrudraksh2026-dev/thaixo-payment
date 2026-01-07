import customerModel from "../models/customerModel.js";
import { safeJSONParse } from "../../public/js/utils/helper.js";
import Response from "../helpers/response.js";

class customerController 
{
    static getThaiCustomers = async (req, res) =>
    {
        try
        {
            const customers = await customerModel.getThaiCustomers();
            customers.forEach((c) =>
            {
                if (c.photos) c.photos = safeJSONParse(c.photos);
            });
            return res.json(Response.success("Customers Fetched Successfully", customers));
        } catch (error)
        {
            return res.json(Response.failure("Failed To Fetch Customers"));
        }
    };

    static getCustomerById = async (req, res) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }
            const customer = await customerModel.getCustomerById(id);
            if (!customer)
            {
                return res.json(Response.failure("Customer Not Found"));
            }
            customer.photos = safeJSONParse(customer.photos);

            return res.json(Response.success("Customer Fetched Successfully", customer));
        } catch (error)
        {

            return res.json(Response.failure("Failed To Fetch Customer"));
        }
    };

    static updateGeneratedOtpById = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }
            const customer = await customerModel.getCustomerById(id);
            if (!customer)
            {
                return res.json(Response.failure("Customer Not Found"));
            }

            const generatedOTP = Math.floor(10000 + Math.random() * 90000);

            const updatedCustomer = await customerModel.updateGeneratedOtpById(id, generatedOTP);

            if (!updatedCustomer)
            {
                return res.json(Response.failure("Secure OTP Generation Failed"));
            }

            return res.json(Response.success("Secure OTP Generated Successfully", updatedCustomer));
        } catch (error)
        {
            next(error);
        }
    }
}

export default customerController;