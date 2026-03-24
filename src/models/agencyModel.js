import db from "../../config/db.js";

// mysql> desc agency;
// +---------------------+--------------+------+-----+-------------------+-------------------+
// | Field               | Type         | Null | Key | Default           | Extra             |
// +---------------------+--------------+------+-----+-------------------+-------------------+
// | id                  | varchar(255) | NO   | PRI | NULL              |                   |
// | name                | varchar(255) | NO   |     | NULL              |                   |
// | owner_name          | varchar(255) | NO   |     | NULL              |                   |
// | photo_id            | varchar(255) | NO   |     | NULL              |                   |
// | bank_name           | varchar(255) | NO   |     | NULL              |                   |
// | bank_account_number | varchar(255) | NO   |     | NULL              |                   |
// | status              | tinyint(1)   | YES  |     | 1                 |                   |
// | created_at          | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
// +---------------------+--------------+------+-----+-------------------+-------------------+

class agencyModel
{
    static getAllAgency = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT * FROM agency;`);
        if (rows.length > 0)
        {
            return rows;
        }
        return [];
    }

    static getAgencyById = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT a.* FROM agency a WHERE a.id = ?`, [id]);
        if (rows.length > 0)
        {
            return rows[0];
        }
        return false;
    };

    static addAgency = async (data, transaction = db) =>
    {
        const [result] = await transaction.query(`INSERT INTO agency (id, name, owner_name, photo_id, bank_name, bank_account_number, status) VALUES (?, ?, ?, ?, ?, ?, ?)`, [data.id, data.name, data.owner_name, data.photo_id, data.bank_name, data.bank_account_number, data.status]);
        if (result.affectedRows > 0)
        {
            return await this.getAgencyById(data.id);
        }
        return false;
    }

    static updateAgencyById = async (data, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE agency SET name = ? , owner_name = ? , photo_id = ? , bank_name = ? , bank_account_number = ? , status = ? WHERE id = ?`, [data.name, data.owner_name, data.photo_id, data.bank_name, data.bank_account_number, data.status, data.id]);
        if (result.affectedRows > 0)
        {
            return await this.getAgencyById(data.id);
        }
        return false;
    }

    static deleteAgencyById = async (id, transaction = db) =>
    {
        const [result] = await transaction.query(`DELETE FROM agency WHERE id = ?`, [id]);
        if (result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }
}

export default agencyModel;