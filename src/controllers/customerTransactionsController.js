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

    static getCustomerEarningsTotalAmountById = async (req, res, next) =>
    {
        try
        {
            // Customer Id
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }
            const totalEarnings = await customerTransactionsModel.getCustomerEarningsTotalAmountById(id);
            if (!totalEarnings)
            {
                return res.json(Response.failure("Customer Total Eanings Not Found"));
            }

            return res.json(Response.success("Customer Total Earnings Fetched Successfully", totalEarnings));
        } catch (error)
        {
            next(error);
        }
    }

    static getCustomerEarningsPaidAmountById = async (req, res, next) =>
    {
        try
        {
            // Customer Id
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }
            const totalPaidAmount = await customerTransactionsModel.getCustomerEarningsPaidAmountById(id);
            if (!totalPaidAmount)
            {
                return res.json(Response.failure("Customer Total Paid Amount Not Found"));
            }

            totalPaidAmount.total_paid = -(totalPaidAmount.total_paid);

            return res.json(Response.success("Customer Total Paid Amount Fetched Successfully", totalPaidAmount));
        } catch (error)
        {
            next(error);
        }
    }

    static getCustomerEarningsTotalAmountByDateRange = async (req, res, next) =>
    {
        try
        {
            // Customer Id
            const id = req.params.id;
            const data = req.query;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }
            if (!data.startDate)
            {
                return res.json(Response.failure("Start Date Not Found"));
            }
            if (!data.endDate)
            {
                return res.json(Response.failure("End Date Not Found"));
            }

            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            if (startDate > endDate)
            {
                return res.json(Response.failure("Start Date Can't Be Greater Than End Date"));
            }

            data.id = id;

            const totalEarnings = await customerTransactionsModel.getCustomerEarningsTotalAmountByDateRange(data);
            if (!totalEarnings)
            {
                return res.json(Response.failure("Customer's Periodically Total Amount Not Found"));
            }
            return res.json(Response.success("Customer's Periodically Total Amount Fetched Successfully", totalEarnings));
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