import db from "../../config/db.js";

// +-------------+--------------+------+-----+-------------------+-------------------+
// | Field       | Type         | Null | Key | Default           | Extra             |
// +-------------+--------------+------+-----+-------------------+-------------------+
// | agency_id   | varchar(255) | NO   | MUL | NULL              |                   |
// | customer_id | int          | NO   | MUL | NULL              |                   |
// | created_at  | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
// +-------------+--------------+------+-----+-------------------+-------------------+

class customerAgencyModel
{
    static isCustomerFromAgency = async (customerId, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT ca.* FROM customer_agency ca WHERE ca.customer_id = ?`, [customerId]);
        if (rows.length > 0)
        {
            return true;
        }
        return false;
    }

    static getAgencyCustomers = async (agencyId, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT c.* FROM customer_agency ca JOIN customer c ON ca.customer_id = c.id WHERE ca.agency_id = ?`, [agencyId]);
        return rows;
    }
}

export default customerAgencyModel;