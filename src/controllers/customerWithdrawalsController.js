import customerWithdrawalsModel from "../models/customerWithdrawalsModel.js";
import Response from "../helpers/response.js";
import customerModel from "../models/customerModel.js";
import { safeJSONParse } from "../../public/js/utils/helper.js";

class customerWithdrawalsController
{
    static WITHDRAWAL_STATUS = [
        "PENDING",
        "DONE",
        "CANCELLED"
    ];

    static getAllCustomerWithdrawals = async (req, res, next) =>
    {
        try
        {
            const withdrawals = await customerWithdrawalsModel.getAllCustomerWithdrawals();

            return res.json(Response.success("Withdrawals Fetched Successfully", withdrawals));
        }
        catch (error)
        {
            next(error);
        }
    }

    static getTotalPaidCustomerWithdrawalsByCustomerId = async (req, res, next) =>
    {
        try
        {
            const id = req.params.customerId;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }

            const isCustomerExists = await customerModel.doesThaiCustomerExists(id);
            if (!isCustomerExists)
            {
                return res.json(Response.failure("Thai Customer Not Found With This Id"));
            }

            const totalPaidWithdrawal = await customerWithdrawalsModel.getCustomerWithdrawalsPaidAmountByCustomerId(id);
            if (!totalPaidWithdrawal)
            {
                return res.json(Response.failure("Paid Withdrawals By Customer Id Not Found"));
            }

            return res.json(Response.success("Paid Withdrawals By Customer Id Fetched Successfully", totalPaidWithdrawal));
        }
        catch (error)
        {
            next(error);
        }
    }

    static getTotalPendingCustomerWithdrawalsByCustomerId = async (req, res, next) =>
    {
        try
        {
            const id = req.params.customerId;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }

            const isCustomerExists = await customerModel.doesThaiCustomerExists(id);
            if (!isCustomerExists)
            {
                return res.json(Response.failure("Thai Customer Not Found With This Id"));
            }

            const totalPendingWithdrawal = await customerWithdrawalsModel.getCustomerWithdrawalsPendingAmountByCustomerId(id);
            if (!totalPendingWithdrawal)
            {
                return res.json(Response.failure("Pending Withdrawals By Customer Id Not Found"));
            }

            return res.json(Response.success("Pending Withdrawals By Customer Id Fetched Successfully", totalPendingWithdrawal));
        }
        catch (error)
        {
            next(error);
        }
    }

    static getAllPendingCustomerWithdrawals = async (req, res, next) =>
    {
        try
        {
            const pendingWithdrawals = await customerWithdrawalsModel.getAllPendingCustomerWithdrawals();
            if (!pendingWithdrawals)
            {
                return res.json(Response.failure("Pending Withdrawals Not Found"));
            }

            return res.json(Response.success("Pending Withdrawals Fetched Successfully", pendingWithdrawals));
        }
        catch (error)
        {
            next(error);
        }
    }

    static getCustomerWithdrawalTotalPendingAmount = async (req, res, next) =>
    {
        try
        {
            const totalPendingWithdrawal = await customerWithdrawalsModel.getCustomerWithdrawalTotalPendingAmount();
            if (!totalPendingWithdrawal)
            {
                return res.json(Response.failure("Total Pending Withdrawal Not Found"));
            }

            return res.json(Response.success("Total Pending Withdrawal Fetched Successfully", totalPendingWithdrawal));
        }
        catch (error)
        {
            next(error);
        }
    }

    static getCustomerWithdrawalByWithdrawalId = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Withdrawal Id Not Found"));
            }
            const withdrawal = await customerWithdrawalsModel.getCustomerWithdrawalByWithdrawalId(id);
            if (!withdrawal)
            {
                return res.json(Response.failure("Withdrawal Not Found"));
            }

            return res.json(Response.success("Withdrawal Fetched Successfully", withdrawal));
        }
        catch (error)
        {
            next(error);
        }
    }

    static getAllCustomerWithdrawalsByCustomerId = async (req, res, next) =>
    {
        try
        {
            const id = req.params.customerId;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }

            const isCustomerExists = await customerModel.doesThaiCustomerExists(id);
            if (!isCustomerExists)
            {
                return res.json(Response.failure("Thai Customer Not Found With This Id"));
            }

            const withdrawals = await customerWithdrawalsModel.getCustomerWithdrawalsByCustomerId(id);
            if (!withdrawals)
            {
                return res.json(Response.failure("Withdrawals By Customer Id Not Found"));
            }

            return res.json(Response.success("Withdrawals By Customer Id Fetched Successfully", withdrawals));
        }
        catch (error)
        {
            next(error);
        }
    }

    static getCustomerWithdrawalsByDateRangeByCustomerId = async (req, res, next) =>
    {
        try
        {
            const id = req.params.customerId;
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

            data.customerId = id;

            const withdrawals = await customerWithdrawalsModel.getCustomerWithdrawalsByDateRangeByCustomerId(data);
            if (!withdrawals)
            {
                return res.json(Response.failure("Withdrawals By Date Range Not Found"));
            }

            return res.json(Response.success(`Withdrawals Between ${data.startDate} To ${data.endDate} Fetched Successfully`, withdrawals));
        }
        catch (error)
        {
            next(error);
        }
    }

    static getCustomerWithdrawalsTotalAmountByDateRangeByCustomerId = async (req, res, next) =>
    {
        try
        {
            const id = req.params.customerId;
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

            data.customerId = id;

            const withdrawal = await customerWithdrawalsModel.getCustomerWithdrawalsTotalAmountByDateRangeByCustomerId(data);
            if (!withdrawal)
            {
                return res.json(Response.failure("Withdrawal Not Found"));
            }

            return res.json(Response.success(`Withdrawal Between ${data.startDate} To ${data.endDate} Fetched Successfully`, withdrawal));
        }
        catch (error)
        {
            next(error);
        }
    }

    static addCustomerWithdrawal = async (req, res, next) =>
    {
        try
        {
            const data = req.body;

            if (!data.customerId)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }

            const isCustomerExists = await customerModel.doesThaiCustomerExists(data.customerId);
            if (!isCustomerExists)
            {
                return res.json(Response.failure("Thai Customer Not Found With This Id"));
            }

            if (!data.withdrawalMethod)
            {
                return res.json(Response.failure("Withdrawal Method Not Found"));
            }

            if (!data.withdrawalAmount)
            {
                return res.json(Response.failure("Withdrawal Amount Not Found"));
            }

            if (!data.payoutDetails)
            {
                return res.json(Response.failure("Payout Details Not Found"));
            }

            if (!this.isJSONArrayOfObjects(data.payoutDetails))
            {
                return res.json(Response.failure("Payout Details Having Invalid JSON Data"));
            }
            data.payoutDetails = safeJSONParse(data.payoutDetails, data.payoutDetails);

            if (!data.status)
            {
                return res.json(Response.failure("Status Not Found"));
            }

            if (!this.WITHDRAWAL_STATUS.includes(data.status))
            {
                return res.json(Response.failure("Invalid Status"));
            }

            const withdrawal = await customerWithdrawalsModel.addCustomerWithdrawal(data);
            if (!withdrawal)
            {
                return res.json(Response.failure("Withdrawal Not Added"));
            }

            withdrawal.payoutDetails = safeJSONParse(withdrawal.payoutDetails);

            return res.json(Response.success("Withdrawal Added Successfully", withdrawal));
        }
        catch (error)
        {
            next(error);
        }
    }

    static editCustomerWithdrawal = async (req, res, next) =>
    {
        try
        {
            const data = req.body;
            if (!data.id)
            {
                return res.json(Response.failure("Withdrawal Id Not Found"));
            }

            if (!data.customerId)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }

            const isCustomerExists = await customerModel.doesThaiCustomerExists(data.customerId);
            if (!isCustomerExists)
            {
                return res.json(Response.failure("Thai Customer Not Found With This Id"));
            }

            if (!data.withdrawalMethod)
            {
                return res.json(Response.failure("Withdrawal Method Not Found"));
            }

            if (!data.withdrawalAmount)
            {
                return res.json(Response.failure("Withdrawal Amount Not Found"));
            }

            if (!data.payoutDetails)
            {
                return res.json(Response.failure("Payout Details Not Found"));
            }

            if (!this.isJSONArrayOfObjects(data.payoutDetails))
            {
                return res.json(Response.failure("Payout Details Having Invalid JSON Data"));
            }
            data.payoutDetails = JSON.parse(data.payoutDetails);

            if (!data.status)
            {
                return res.json(Response.failure("Status Not Found"));
            }

            if (!this.WITHDRAWAL_STATUS.includes(data.status))
            {
                return res.json(Response.failure("Invalid Status"));
            }

            const withdrawal = await customerWithdrawalsModel.editCustomerWithdrawal(data);
            if (!withdrawal)
            {
                return res.json(Response.failure("Withdrawal Not Edited"));
            }

            withdrawal.payoutDetails = safeJSONParse(withdrawal.payoutDetails);

            return res.json(Response.success("Withdrawal Edited Successfully", withdrawal));
        }
        catch (error)
        {
            next(error);
        }
    }

    static deleteCustomerWithdrawal = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Withdrawal Id Not Found"));
            }
            const withdrawal = await customerWithdrawalsModel.deleteCustomerWithdrawal(id);
            if (!withdrawal)
            {
                return res.json(Response.failure("Withdrawal Not Deleted"));
            }

            return res.json(Response.success("Withdrawal Deleted Successfully", withdrawal));
        }
        catch (error)
        {
            next(error);
        }
    }

    static updateSelectedCustomerWithdrawalStatus = async (req, res, next) =>
    {
        try
        {
            const data = req.body;
            const ids = safeJSONParse(data?.ids, []);
            const status = data?.status;
            if (!ids.length)
            {
                return res.json(Response.failure("Withdrawal Ids Not Found"));
            }

            if (!this.WITHDRAWAL_STATUS.includes(status))
            {
                return res.json(Response.failure("Invalid Status"));
            }

            const withdrawal = await customerWithdrawalsModel.updateSelectedCustomerWithdrawalStatus(ids, status);
            if (!withdrawal)
            {
                return res.json(Response.failure("Withdrawals Not Updated"));
            }

            return res.json(Response.success("Withdrawals Updated Successfully", withdrawal));
        }
        catch (error)
        {
            next(error);
        }
    }

    static isJSONArrayOfObjects = (data) =>
    {
        if (!data || typeof data !== 'string')
        {
            return false;
        }

        try
        {
            const parsed = JSON.parse(data);

            if (!Array.isArray(parsed))
            {
                return false;
            }

            return parsed.every(
                item =>
                    typeof item === 'object' &&
                    item !== null &&
                    !Array.isArray(item)
            );
        }
        catch (e)
        {
            return false;
        }
    };
}

export default customerWithdrawalsController;
