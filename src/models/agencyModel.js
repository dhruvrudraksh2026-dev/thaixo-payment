import db from "../../config/db.js";

class agencyModel
{
    static getAllAgency = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT * FROM agency;`);
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