import db from "../../config/db.js";

class customerModel
{
    static getThaiCustomers = async (transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT * FROM customer WHERE country_code = '+66'")
        return rows;
    }

    static getCreatorThaiCustomers = async (transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT * FROM customer WHERE country_code = '+66' AND is_creator = 1");
        return rows;
    }

    static getNonCreatorThaiCustomers = async (transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT * FROM customer WHERE country_code = '+66' AND is_creator = 0");
        return rows;
    }

    static getCustomerById = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT c.* FROM customer c WHERE c.id = ?`, [id]);
        if (rows.length > 0)
        {
            return rows[0];
        }
        return false;
    };

    static doesThaiCustomerExists = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT * FROM customer WHERE id = ? AND country_code = '+66'", [id]);
        return rows[0] ? true : false;
    }

    static updateGeneratedOtpById = async (id, otp, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE customer SET secure_otp = ? WHERE id = ?`, [otp, id]);
        if (result.affectedRows > 0)
        {
            return await this.getCustomerById(id);
        }
        return false;
    }

    static isCustomerCreatorById = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT is_creator FROM customer WHERE id = ?`, [id]);
        if (rows.length > 0)
        {
            return Boolean(rows[0]?.is_creator);
        }
        return false;
    }

    static toggleCreatorById = async (id, transaction = db) =>
    {
        const isCreator = await this.isCustomerCreatorById(id);
        let bonus_coins = !isCreator ? 250 : 0; // If Not Creator Then It will be Creator So Update the Coins Then

        const [result] = await transaction.query(`UPDATE customer SET is_creator = !is_creator, coins = ? WHERE id = ?`, [bonus_coins, id]);
        if (result.affectedRows > 0)
        {
            return await this.getCustomerById(id);
        }
        return false;
    }

    static verifyCustomerLegalDetailsById = async (id, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE customer SET is_legal_details_verified = true , legal_details_verification_status = 'APPROVED'  WHERE id = ?`, [id]);
        if (result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }

    static unverifyCustomerLegalDetailsById = async (id, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE customer SET is_legal_details_verified = false , legal_details_verification_status = 'REJECTED'  WHERE id = ?`, [id]);
        if (result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }

    static updateCustomerLegalDetails = async (data, transaction = db) =>
    {
        const [result] = await transaction.query('UPDATE customer SET customer_legal_details = ? WHERE id = ?', [JSON.stringify(data.customer_legal_details), data.id]);
        if (result.affectedRows > 0)
        {
            return await this.getCustomerById(data.id, transaction);
        }
        return false;
    }
}

export default customerModel;