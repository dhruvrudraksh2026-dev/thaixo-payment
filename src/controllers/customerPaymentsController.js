import Response from "../helpers/response.js";
import customerPaymentsModel from "../models/customerPaymentsModel.js";

class customerPaymentsController 
{

    static getAllCustomerPayments = async (req, res) =>
    {
        try
        {
            const customerPayments = await customerPaymentsModel.getAllCustomerPayments();
            return res.json(Response.success("Customer Payments Fetched Successfully", customerPayments));
        } catch (error)
        {
            return res.json(Response.failure("Failed To Fetch Customer Payments"));
        }
    };

    static getAllCustomerPaymentsTotalAmount = async (req, res) =>
    {
        try
        {
            const customerPaymentsTotalAmount = await customerPaymentsModel.getAllCustomerPaymentsTotalAmount();
            return res.json(Response.success("Customer Payments Total Amount Fetched Successfully", customerPaymentsTotalAmount));
        } catch (error)
        {
            return res.json(Response.failure("Failed To Fetch Customer Payments Total Amount"));
        }
    };

    static getCustomerPaymentById = async (req, res) =>
    {
        try
        {
            const customerPayment = await customerPaymentsModel.getCustomerPaymentById(req.params.id);

            if (!customerPayment) return res.json(Response.failure("Customer Payment Not Found"));

            return res.json(Response.success("Customer Payment Fetched Successfully", customerPayment));
        } catch (error)
        {
            return res.json(Response.failure("Failed To Fetch Customer Payment"));
        }
    };

}
export default customerPaymentsController;