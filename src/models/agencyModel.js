import db from "../../config/db.js";

// +----------------------+--------------+------+-----+-------------------+-------------------+
// | Field                | Type         | Null | Key | Default           | Extra             |
// +----------------------+--------------+------+-----+-------------------+-------------------+
// | id                   | varchar(255) | NO   | PRI | NULL              |                   |
// | name                 | varchar(255) | NO   |     | NULL              |                   |
// | status               | tinyint(1)   | YES  |     | 1                 |                   |
// | agency_legal_details | json         | YES  |     | _utf8mb4\'{}\'    | DEFAULT_GENERATED |
// | created_at           | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
// +----------------------+--------------+------+-----+-------------------+-------------------+

class agencyModel
{
    static getAllAgency = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT * FROM agency;`, [id]);
        if (rows.length > 0)
        {
            return rows;
        }
        return false;
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
        const [result] = await transaction.query(`INSERT INTO agency (id, name, status, agency_legal_details) VALUES (?, ?, ?, ?)`, [data.id, data.name, data.status, data.agency_legal_details]);
        if (result.affectedRows > 0)
        {
            return await this.getAgencyById(data.id);
        }
        return false;
    }

    static updateAgencyById = async (data, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE agency SET name = ? , status = ? , agency_legal_details = ? WHERE id = ?`, [data.name, data.status, data.agency_legal_details, data.id]);
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