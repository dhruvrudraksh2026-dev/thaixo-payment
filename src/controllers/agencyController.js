import ShortUniqueId from "short-unique-id";
import Response from "../helpers/response.js";
import agencyModel from "../models/agencyModel.js";

class agencyController
{
    static getAllAgency = async (req, res, next) =>
    {
        try
        {
            const agencies = await agencyModel.getAllAgency();

            return res.json(Response.success("Agencies Fetched Successfully", agencies));
        } catch (error)
        {
            next(error);
        }
    }

    static getAgencyById = async (req, res, next) =>
    {

        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Agency Id Is Required"));
            }

            const agency = await agencyModel.getAgencyById(id);
            if (!agency)
            {
                return res.json(Response.failure("Agency Not Found"));
            }

            return res.json(Response.success("Agency Fetched Successfully", agency));
        } catch (error)
        {
            next(error);
        }
    }

    static addAgency = async (req, res, next) =>
    {
        try
        {
            const data = req.body;
            if (!data.name)
            {
                return res.json(Response.failure("Agency Name Is Required"));
            }

            if (!data.agency_legal_details)
            {
                return res.json(Response.failure("Agency Legal Details Is Required"));
            }

            if (!data.status)
            {
                return res.json(Response.failure("Agency Status Is Required"));
            }

            const uid = new ShortUniqueId({ length: 8 });
            data.id = `XO${uid.rnd()}`;

            const agency = await agencyModel.addAgency(data);

            if (!agency)
            {
                return res.json(Response.failure("Agency Addition Failed"));
            }

            return res.json(Response.success("Agency Added Successfully", agency));
        }
        catch (error)
        {
            next(error);
        }
    }

    static updateAgencyById = async (req, res, next) =>
    {
        try
        {
            const data = req.body;
            if (!data.id)
            {
                return res.json(Response.failure("Agency Id Is Required"));
            }

            if (!data.name)
            {
                return res.json(Response.failure("Agency Name Is Required"));
            }

            if (!data.agency_legal_details)
            {
                return res.json(Response.failure("Agency Legal Details Is Required"));
            }

            if (!data.status)
            {
                return res.json(Response.failure("Agency Status Is Required"));
            }

            const agency = await agencyModel.updateAgencyById(data);

            if (!agency)
            {
                return res.json(Response.failure("Agency Updation Failed"));
            }

            return res.json(Response.success("Agency Updated Successfully", agency));
        }
        catch (error)
        {
            next(error);
        }
    }

    static deleteAgencyById = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Agency Id Is Required"));
            }

            const agency = await agencyModel.getAgencyById(id);
            if (!agency)
            {
                return res.json(Response.failure("Agency Not Found"));
            }

            const result = await agencyModel.deleteAgencyById(id);

            if (!result)
            {
                return res.json(Response.failure("Agency Deletion Failed"));
            }

            return res.json(Response.success("Agency Deleted Successfully", agency));
        }
        catch (error)
        {
            next(error);
        }
    }
}

export default agencyController;
