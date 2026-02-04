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

            if (!this.isJSONParsable(data.payoutDetails))
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

            if (!this.isJSONParsable(data.payoutDetails))
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

    static isJSONParsable = (data) =>
    {
        if (!data)
        {
            return false;
        }

        if (typeof data !== 'string')
        {
            return false;
        }

        try
        {
            JSON.parse(data);
            return true;
        } catch (e)
        {
            return false;
        }
    };
}

export default customerWithdrawalsController;
