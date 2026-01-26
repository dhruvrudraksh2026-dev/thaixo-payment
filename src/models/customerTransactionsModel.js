import db from "../../config/db.js";

class customerTransactionsModel
{
    static getCustomerTransactionsById = async (id, transaction = db) =>
    {
        // Fetching Transactions With Package Details
        const [rows] = await transaction.query("SELECT ct.*, DATE_FORMAT(ct.created_at, '%d %b %Y, %h:%i %p') as created_at, gp.package_name FROM customer_transactions ct JOIN girls_package gp ON ct.package_id = gp.id WHERE ct.customer_id=?", [id]);
        return rows;
    }

    static getCustomerTransactionsTotalAmountById = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT SUM(earnings) AS total_amount FROM customer_transactions WHERE customer_id = ?", [id]);
        return rows[0] || 0;
    }
}

export default customerTransactionsModel;