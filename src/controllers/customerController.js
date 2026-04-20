import customerModel from "../models/customerModel.js";
import { safeJSONParse } from "../../public/js/utils/helper.js";
import Response from "../helpers/response.js";
import { getImageUrl } from "../helpers/helper.js";
import webNotificationsModel from "../models/webNotificationsModel.js";
import db from "../../config/db.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

class customerController 
{
    static getThaiCustomers = async (req, res) =>
    {
        try
        {
            const customers = await customerModel.getThaiCustomers();
            customers.forEach((c) =>
            {
                if (c.photos) c.photos = safeJSONParse(c.photos);
            });
            return res.json(Response.success("Customers Fetched Successfully", customers));
        } catch (error)
        {
            next(error);
        }
    };

    static getPendingLegalDetailsVerificationThaiCustomers = async (req, res, next) =>
    {
        try
        {
            const customers = await customerModel.getPendingLegalDetailsVerificationThaiCustomers();
            customers.forEach((c) =>
            {
                if (c.photos) c.photos = safeJSONParse(c.photos);
            });
            return res.json(Response.success("Pending Legal Details Verification Thai Customers Fetched Successfully", customers));
        } catch (error)
        {
            next(error);
        }
    }

    static getCreatorThaiCustomers = async (req, res, next) =>
    {
        try
        {
            const customers = await customerModel.getCreatorThaiCustomers();
            customers.forEach((c) =>
            {
                if (c.photos) c.photos = safeJSONParse(c.photos);
            });
            return res.json(Response.success("Creator Thai Customers Fetched Successfully", customers));
        } catch (error)
        {
            next(error);
        }
    };

    static getNonCreatorThaiCustomers = async (req, res, next) =>
    {
        try
        {
            const customers = await customerModel.getNonCreatorThaiCustomers();
            customers.forEach((c) =>
            {
                if (c.photos) c.photos = safeJSONParse(c.photos);
            });
            return res.json(Response.success("Non Creator Thai Customers Fetched Successfully", customers));
        } catch (error)
        {
            next(error);
        }
    };

    static getCustomerById = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }
            const customer = await customerModel.getCustomerById(id);
            if (!customer)
            {
                return res.json(Response.failure("Customer Not Found"));
            }
            customer.photos = safeJSONParse(customer.photos);
            customer.profile_photo = getImageUrl(`customerProfilePhotos/${id}`, customer.profile_photo);

            customer.photos = customer.photos.map((photo) => getImageUrl(`customerPhotos/${id}`, photo));

            customer.customer_legal_details = safeJSONParse(customer?.customer_legal_details || "{}");

            const isCustomerHavingLegalDetails = Object.keys(customer.customer_legal_details).length > 0;

            if (isCustomerHavingLegalDetails && customer.is_from_agency === 0)
            {
                customer.customer_legal_details.legal_id_image = getImageUrl(`customerLegalPhotos/${id}`, customer.customer_legal_details.legal_id_image);
                customer.customer_legal_details.passbook_image = getImageUrl(`customerLegalPhotos/${id}`, customer.customer_legal_details.passbook_image);
            }
            else if (isCustomerHavingLegalDetails && customer.is_from_agency === 1)
            {
                customer.customer_legal_details.passport_image = getImageUrl(`customerLegalPhotos/${id}`, customer.customer_legal_details.passport_image);
            }

            return res.json(Response.success("Customer Fetched Successfully", customer));
        } catch (error)
        {
            next(error);
        }
    };

    static toggleCreatorById = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }

            const customer = await customerModel.getCustomerById(id);
            if (!customer)
            {
                return res.json(Response.failure("Customer Not Found"));
            }

            const updatedCustomer = await customerModel.toggleCreatorById(id);
            if (!updatedCustomer)
            {
                return res.json(Response.failure("Failed To Toggle Creator"));
            }

            return res.json(Response.success("Creator Toggled Successfully", updatedCustomer));
        } catch (error)
        {
            next(error);
        }
    };

    static updateGeneratedOtpById = async (req, res, next) =>
    {
        try
        {
            const id = req.params.id;
            if (!id)
            {
                return res.json(Response.failure("Customer Id Not Found"));
            }
            const customer = await customerModel.getCustomerById(id);
            if (!customer)
            {
                return res.json(Response.failure("Customer Not Found"));
            }

            const generatedOTP = Math.floor(10000 + Math.random() * 90000);

            const updatedCustomer = await customerModel.updateGeneratedOtpById(id, generatedOTP);

            if (!updatedCustomer)
            {
                return res.json(Response.failure("Secure OTP Generation Failed"));
            }

            return res.json(Response.success("Secure OTP Generated Successfully", updatedCustomer));
        } catch (error)
        {
            next(error);
        }
    }

    // Approve Customer's Legal Details Verification
    static verifyCustomerLegalDetailsById = async (req, res, next) =>
    {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try
        {
            const id = req.params.id;
            if (!id)
            {
                await connection.rollback();
                return res.json(Response.failure("Customer Id Not Found"));
            }

            const customer = await customerModel.getCustomerById(id);
            if (!customer)
            {
                await connection.rollback();
                return res.json(Response.failure("Customer Not Found"));
            }

            const updatedCustomer = await customerModel.verifyCustomerLegalDetailsById(id);
            if (!updatedCustomer)
            {
                await connection.rollback();
                return res.json(Response.failure("Failed To Verify Customer Legal Details"));
            }

            // Web Notifications
            const webNotification = await webNotificationsModel.createWebNotification({
                customer_id: id,
                type: "LEGAL_DETAILS_VERIFIED",
                title: "Legal Details Verified",
                body: `Hi ${customer.name}, your legal details has been successfully verified.`
            }, connection);

            if (!webNotification)
            {
                await connection.rollback();
                return res.json(Response.failure("Failed To Create Web Notification"));
            }

            await connection.commit();
            return res.json(Response.success("Customer Profile Verified Successfully", updatedCustomer));
        } catch (error)
        {
            await connection.rollback();
            next(error);
        } finally
        {
            connection.release();
        }
    }

    static removeCustomerLegalDetailsById = async (req, res, next) =>
    {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try
        {
            const id = req.params.id;
            if (!id)
            {
                await connection.rollback();
                return res.json(Response.failure("Customer Id Not Found"));
            }

            const customer = await customerModel.getCustomerById(id, connection);
            if (!customer)
            {
                await connection.rollback();
                return res.json(Response.failure("Customer Not Found"));
            }

            const updatedCustomer = await customerModel.removeCustomerLegalDetailsById(id, connection);
            if (!updatedCustomer)
            {
                await connection.rollback();
                return res.json(Response.failure("Failed To Remove Customer Legal Details"));
            }

            // Web Notifications
            const webNotification = await webNotificationsModel.createWebNotification({
                customer_id: id,
                type: "LEGAL_DETAILS_REMOVED",
                title: "Legal Details Removed",
                body: `Hi ${customer.name}, your legal details has been successfully removed.`
            }, connection);

            if (!webNotification)
            {
                await connection.rollback();
                return res.json(Response.failure("Failed To Create Web Notification"));
            }

            await connection.commit();
            return res.json(Response.success("Customer Profile Legal Details Removed Successfully", updatedCustomer));
        } catch (error)
        {
            await connection.rollback();
            next(error);
        } finally
        {
            connection.release();
        }
    }

    // Reject Customer's Legal Details Verification
    static unverifyCustomerLegalDetailsById = async (req, res, next) =>
    {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try
        {
            const id = req.params.id;
            if (!id)
            {
                await connection.rollback();
                return res.json(Response.failure("Customer Id Not Found"));
            }

            const customer = await customerModel.getCustomerById(id, connection);
            if (!customer)
            {
                await connection.rollback();
                return res.json(Response.failure("Customer Not Found"));
            }

            const updatedResult = await customerModel.unverifyCustomerLegalDetailsById(id, connection);
            if (!updatedResult)
            {
                await connection.rollback();
                return res.json(Response.failure("Failed To Unverify Customer Legal Details"));
            }

            const updatedCustomer = await customerModel.updateCustomerLegalDetails({ id, customer_legal_details: {} }, connection);
            if (!updatedCustomer)
            {
                await connection.rollback();
                return res.json(Response.failure("Failed To Delete Verification Photos"));
            }

            // Calling API To Delete Customer Legal Photos
            const deleteCustomerLegalPhotosResponse = await axios.delete(`${process.env.BASE_IMAGE_URL}/api/customer/legal-photos/${id}`);

            if (!deleteCustomerLegalPhotosResponse?.data?.success)
            {
                await connection.rollback();
                return res.json(Response.failure("Failed To Delete Customer Legal Photos"));
            }

            // Web Notifications
            const webNotification = await webNotificationsModel.createWebNotification({
                customer_id: id,
                type: "LEGAL_DETAILS_UNVERIFIED",
                title: "Legal Details Unverified",
                body: `Hi ${customer.name}, your legal details has been unverified.`
            }, connection);

            if (!webNotification)
            {
                await connection.rollback();
                return res.json(Response.failure("Failed To Create Web Notification"));
            }

            await connection.commit();
            return res.json(Response.success("Customer Legal Details Unverified Successfully", updatedCustomer));
        } catch (error)
        {
            await connection.rollback();
            next(error);
        } finally
        {
            connection.release();
        }
    }
}

export default customerController;