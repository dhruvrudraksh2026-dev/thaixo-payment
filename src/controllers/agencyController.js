import ShortUniqueId from "short-unique-id";
import Response from "../helpers/response.js";
import agencyModel from "../models/agencyModel.js";
import { deleteFile, uploadFile } from "../helpers/file.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { getPublicFileUrl } from "../helpers/helper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class agencyController
{
    static fileLocation = "../../public/agencies/";

    static getAllAgency = async (req, res, next) =>
    {
        try
        {
            const agencies = await agencyModel.getAllAgency();

            agencies.forEach(agency =>
            {
                agency.photo_id = getPublicFileUrl("agencies", agency.photo_id);
            });

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

            agency.photo_id = getPublicFileUrl("agencies", agency.photo_id);

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
            const file = req.file;

            if (!data.name)
            {
                return res.json(Response.failure("Agency Name Is Required"));
            }

            if (!data.owner_name)
            {
                return res.json(Response.failure("Agency Owner Name Is Required"));
            }

            if (!file)
            {
                return res.json(Response.failure("Agency Photo Id Is Required"));
            }

            if (!data.bank_name)
            {
                return res.json(Response.failure("Agency Bank Name Is Required"));
            }

            if (!data.bank_account_number)
            {
                return res.json(Response.failure("Agency Bank Account Number Is Required"));
            }

            if (!data.status)
            {
                return res.json(Response.failure("Agency Status Is Required"));
            }

            // -------------------------------------------------------------------------
            // Generating Agency Short Id Starts With XO And Uploading Image
            // -------------------------------------------------------------------------
            const uid = new ShortUniqueId({ length: 8 });
            data.id = `XO${uid.rnd()}`;

            const extName = path.extname(file.originalname);

            if (extName != ".jpeg" && extName != ".jpg" && extName != ".png")
            {
                return res.json(Response.failure("Invalid File Type"));
            }

            const fileName = `agency_${data.id}${extName}`;
            data.photo_id = fileName;

            const agency = await agencyModel.addAgency(data);

            if (!agency)
            {
                return res.json(Response.failure("Agency Addition Failed"));
            }

            if (file)
            {
                const uploadDir = path.join(__dirname, this.fileLocation);
                uploadFile(file, fileName, uploadDir);
            }
            // -------------------------------------------------------------------------

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
            const file = req.file;

            if (!data.id)
            {
                return res.json(Response.failure("Agency Id Is Required"));
            }

            const agency = await agencyModel.getAgencyById(data.id);
            if (!agency)
            {
                return res.json(Response.failure("Agency Not Found"));
            }

            if (!data.name)
            {
                return res.json(Response.failure("Agency Name Is Required"));
            }

            if (!data.owner_name)
            {
                return res.json(Response.failure("Agency Owner Name Is Required"));
            }

            if (!data.bank_name)
            {
                return res.json(Response.failure("Agency Bank Name Is Required"));
            }

            if (!data.bank_account_number)
            {
                return res.json(Response.failure("Agency Bank Account Number Is Required"));
            }

            if (!data.status)
            {
                return res.json(Response.failure("Agency Status Is Required"));
            }

            if (file)
            {
                const extName = path.extname(file.originalname);

                if (extName != ".jpeg" && extName != ".jpg" && extName != ".png")
                {
                    return res.json(Response.failure("Invalid File Type"));
                }

                const fileName = `agency_${data.id}${extName}`;
                data.photo_id = fileName;
            } else
            {
                data.photo_id = agency.photo_id;
            }

            const updatedAgency = await agencyModel.updateAgencyById(data);

            if (!updatedAgency)
            {
                return res.json(Response.failure("Agency Updation Failed"));
            }

            if (file)
            {
                const uploadDir = path.join(__dirname, this.fileLocation);

                // ------------------------------------------------------------
                // Deleting Old File
                // ------------------------------------------------------------
                deleteFile(agency.photo_id, uploadDir);
                // ------------------------------------------------------------

                // ------------------------------------------------------------
                // Uploading New File
                // ------------------------------------------------------------
                uploadFile(file, data.photo_id, uploadDir);
                // ------------------------------------------------------------
            }

            return res.json(Response.success("Agency Updated Successfully", updatedAgency));
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
