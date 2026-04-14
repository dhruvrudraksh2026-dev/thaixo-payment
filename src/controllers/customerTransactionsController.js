import { datetimeConverter } from "../helpers/helper.js";
import Response from "../helpers/response.js";
import { formatMinutesToClock } from "../helpers/timeFormatHelperFunctions.js";
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

            customer_transactions.forEach(transaction =>
            {
                transaction.formatted_time = formatMinutesToClock(transaction.minutes);
            });

            return res.json(Response.success("Customer Transactions Fetched Successfully", customer_transactions));
        } catch (error)
        {
            next(error);
        }
    }

    static getAllCustomerTransactionsByIdAndDateRange = async (req, res, next) =>
    {
        try
        {
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

            const customer_transactions = await customerTransactionsModel.getAllCustomerTransactionsByIdAndDateRange(data);
            if (!customer_transactions)
            {
                return res.json(Response.failure("Customer Transactions Not Found"));
            }

            customer_transactions.forEach(transaction =>
            {
                transaction.formatted_time = formatMinutesToClock(transaction.minutes);
            });

            return res.json(Response.success(`Customer Transactions Between ${data.startDate} To ${data.endDate} Fetched Successfully`, customer_transactions));
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
}

export default customerTransactionsController;