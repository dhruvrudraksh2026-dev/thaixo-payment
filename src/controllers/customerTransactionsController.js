import { datetimeConverter } from "../helpers/helper.js";
import Response from "../helpers/response.js";
import customerTransactionsModel from "../models/customerTransactionsModel.js";

class customerTransactionsController
{
    static TRANSACTION_STATUS = [
        "PENDING",
        "DONE",
        "CANCELLED"
    ];

    static getAllCustomerTransactionsById = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Transactions Id Not Found"));
            }
            const customer_transactions = await customerTransactionsModel.getAllCustomerTransactionsById(id);
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

    static getCustomerTransactionByCustomerIdAndTimestamp = async (req, res, next) =>
    {
        try
        {
            const data = req.query;
            if (!data.customerId)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }
            if (!data.createdAt)
            {
                return res.json(Response.failure("Timestamp Not Found"));
            }
            const customer_transaction = await customerTransactionsModel.getCustomerTransactionByCustomerIdAndTimestamp(data.customerId, data.createdAt);
            if (!customer_transaction)
            {
                return res.json(Response.failure("Customer Transaction Not Found"));
            }

            return res.json(Response.success("Customer Transaction Fetched Successfully", customer_transaction));
        } catch (error)
        {
            next(error);
        }
    }

    static getCustomerTransactionsTotalAmountById = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Transactions Id Not Found"));
            }
            const customer_transactions_minutes = await customerTransactionsModel.getCustomerTransactionsTotalAmountById(id);
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

    static addCustomerTransaction = async (req, res, next) =>
    {
        try
        {
            const data = req.body;

            if (!data.customerId)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }

            if (!data.packageId)
            {
                return res.json(Response.failure("Package Id Not Found"));
            }

            if (!data.minutes || !data.rate)
            {
                return res.json(Response.failure("Minutes and Rate Per Minute Is Required"));
            }

            if (!data.amount)
            {
                return res.json(Response.failure("Transaction Amount Not Found"));
            }

            if (!data.status)
            {
                return res.json(Response.failure("Transaction Status Not Found"));
            }

            if (!this.TRANSACTION_STATUS.includes(data.status))
            {
                return res.json(Response.failure("Invalid Transaction Status"));
            }

            if (data.amount > 0)
            {
                data.amount = - Number(data.amount);
            }

            const response = await customerTransactionsModel.addCustomerTransaction(data);
            if (!response)
            {
                return res.json(Response.failure("Customer Transaction Adding Failed"));
            }

            return res.json(Response.success("Customer Transaction Added Successfully", response));
        } catch (error)
        {
            next(error);
        }
    }

    static editCustomerTransaction = async (req, res, next) =>
    {
        try
        {
            const data = req.body;
            if (!data.customerId)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }

            if (!data.packageId)
            {
                return res.json(Response.failure("Package Id Not Found"));
            }

            if (!data.minutes || !data.rate)
            {
                return res.json(Response.failure("Minutes and Rate Per Minute Is Required"));
            }

            if (!data.amount)
            {
                return res.json(Response.failure("Transaction Amount Not Found"));
            }

            if (!data.status)
            {
                return res.json(Response.failure("Transaction Status Not Found"));
            }

            if (!this.TRANSACTION_STATUS.includes(data.status))
            {
                return res.json(Response.failure("Invalid Transaction Status"));
            }
            data.amount = Number(data.amount);
            data.createdAt = datetimeConverter(data.createdAt);

            const response = await customerTransactionsModel.editCustomerTransaction(data);
            if (!response)
            {
                return res.json(Response.failure("Customer Transaction Editing Failed"));
            }

            return res.json(Response.success("Customer Transaction Edited Successfully", response));
        } catch (error)
        {
            next(error);
        }
    }
}

export default customerTransactionsController;