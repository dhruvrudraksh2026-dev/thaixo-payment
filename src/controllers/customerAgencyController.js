import Response from "../helpers/response.js";
import customerAgencyModel from "../models/customerAgnecyModel.js";

class customerAgencyController
{
    static getAgencyCustomers = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Agency Id Is Required"));
            }

            const customers = await customerAgencyModel.getAgencyCustomers(id);
            return res.json(Response.success("Customers Fetched Successfully", customers));
        } catch (error)
        {
            next(error);
        }
    }
}

export default customerAgencyController;