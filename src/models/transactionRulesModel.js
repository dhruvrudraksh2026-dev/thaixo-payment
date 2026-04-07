import db from "../../config/db.js";

class transactionRulesModel
{

    static getTransactionRules = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT * FROM transaction_rules`);
        return rows[0] || {};
    }

}

export default transactionRulesModel;