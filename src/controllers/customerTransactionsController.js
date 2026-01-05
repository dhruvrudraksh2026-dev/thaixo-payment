import Response from "../helpers/response.js";
import customerTransactionsModel from "../models/customerTransactionsModel.js";

class customerTransactionsController
{
    static getCustomerTransactionsById = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Transactions Id Not Found"));
            }
            const customer_transactions = await customerTransactionsModel.getCustomerTransactionsById(id);
            if (!customer_transactions)
            {
                return res.json(Response.failure("Customer Transactions Not Found"));
            }

            return res.json(Response.success("Customer Transactions Fetched Successfully", customer_transactions));
        } catch (error)
        {
            next(error);
        }
    }

    static getCustomerTransactionsTotalMinutesById = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Transactions Id Not Found"));
            }
            const customer_transactions_minutes = await customerTransactionsModel.getCustomerTransactionsTotalMinutesById(id);
            if (!customer_transactions_minutes)
            {
                return res.json(Response.failure("Customer Transactions Total Minutes Not Found"));
            }

            return res.json(Response.success("Customer Transactions Total Minutes Fetched Successfully", customer_transactions_minutes));
        } catch (error)
        {
            next(error);
        }
    }
}

export default customerTransactionsController;