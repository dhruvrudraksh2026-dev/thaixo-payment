import db from "../../config/db.js";

class customerModel 
{
    static getThaiCustomers = async (transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT * FROM customer WHERE country_code = '+66'")
        return rows;
    }

    static getCustomerById = async (id) =>
    {
        const [rows] = await db.query(`SELECT c.* FROM customer c WHERE c.id = ?`, [id]);
        if (rows.length > 0)
        {
            return rows[0];
        }
        return false;
    };
}

export default customerModel;