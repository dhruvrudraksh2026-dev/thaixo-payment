import customerModel from "../models/customerModel.js";
import { safeJSONParse } from "../../public/js/utils/helper.js";
import Response from "../helpers/response.js";
import { getImageUrl } from "../helpers/helper.js";
import webNotificationsModel from "../models/webNotificationsModel.js";
import db from "../../config/db.js";

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

            if (isCustomerHavingLegalDetails)
            {
                customer.customer_legal_details.legal_id_image = getImageUrl(`customerLegalPhotos/${id}`, customer.customer_legal_details.legal_id_image);
                customer.customer_legal_details.passbook_image = getImageUrl(`customerLegalPhotos/${id}`, customer.customer_legal_details.passbook_image);
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

            // // Firebase Notification Flow
            // // Sending Firebase Notification - Even If It Got Failed, We Will update the data
            // const customerToSend = Object.fromEntries(
            //     Object.entries(customer).map(([key, value]) => [
            //         key,
            //         value === null || value === undefined ? "" : JSON.stringify(value)
            //     ])
            // );

            // const notification = {
            //     title: "🎉 Profile Verified",
            //     body: `Hi ${customer.name}, your profile has been successfully verified. You can now enjoy all features without any restrictions`,
            //     data: {
            //         type: "PROFILE_VERIFICATION_APPROVED",
            //         ...customerToSend
            //     }
            // }

            // try
            // {
            //     sendPushNotification(customer.device_token, notification.title, notification.body, notification.data);
            // } catch (error)
            // {
            //     console.log("Firebase Notification Sending Failed - While Approving Application", error);
            // }

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

            // Deleting Legal Photos From Storage And Database
            // const folderPath = path.join(process.cwd(), "public", "customer", String(id));

            // const legal_photos = customer.customer_legal_details ? JSON.parse(customer.customer_legal_details).legal_photos : [];
            // if (!legal_photos)
            // {
            //     await connection.rollback();
            //     return res.json(Response.failure("Legal Photos Not Found"));
            // }

            const updatedCustomer = await customerModel.updateCustomerLegalDetails({ id, customer_legal_details: {} }, connection);
            if (!updatedCustomer)
            {
                await connection.rollback();
                return res.json(Response.failure("Failed To Delete Verification Photos"));
            }

            // // Firebase Notification Flow
            // // Sending Firebase Notification - Even If It Got Failed, We Will update the data
            // const customerToSend = Object.fromEntries(
            //     Object.entries(updatedCustomer).map(([key, value]) => [
            //         key,
            //         value === null || value === undefined ? "" : JSON.stringify(value)
            //     ])
            // );

            // const notification = {
            //     title: "❌ Profile Verification Failed",
            //     body: `Hi ${updatedCustomer.name}, we couldn’t verify your profile. Please re-upload verification photos to continue`,
            //     data: {
            //         type: "PROFILE_VERIFICATION_REJECTED",
            //         ...customerToSend
            //     }
            // }

            // try
            // {
            //     sendPushNotification(updatedCustomer.device_token, notification.title, notification.body, notification.data);
            // } catch (error)
            // {
            //     console.log("Firebase Notification Sending Failed - While Unapproving Application", error);
            // }

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