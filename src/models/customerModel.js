import db from "../../config/db.js";

class customerModel 
{
    static getThaiCustomers = async (transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT * FROM customer WHERE country_code = '+66'")
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

    static updateGeneratedOtpById = async (id, otp, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE customer SET secure_otp = ? WHERE id = ?`, [otp, id]);
        if (result.affectedRows > 0)
        {
            return await this.getCustomerById(id);
        }
        return false;
    }

    static toggleWhiteListedById = async (id, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE customer SET white_listed = !white_listed WHERE id = ?`, [id]);
        if (result.affectedRows > 0)
        {
            return await this.getCustomerById(id);
        }
        return false;
    }
}

export default customerModel;