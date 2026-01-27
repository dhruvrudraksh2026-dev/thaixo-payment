import db from "../../config/db.js";

class customerTransactionsModel
{
    static getAllCustomerTransactionsById = async (id, transaction = db) =>
    {
        // Fetching Transactions With Package Details
        const [rows] = await transaction.query("SELECT ct.*, DATE_FORMAT(ct.created_at, '%d %b %Y, %h:%i:%s %p') as created_at, gp.package_name FROM customer_transactions ct JOIN girls_package gp ON ct.package_id = gp.id WHERE ct.customer_id=? order by ct.created_at", [id]);
        return rows;
    }

    static getCustomerTransactionByCustomerId = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT ct.*, DATE_FORMAT(ct.created_at, '%d %b %Y, %h:%i:%s %p') as created_at, gp.package_name FROM customer_transactions ct JOIN girls_package gp ON ct.package_id = gp.id WHERE ct.customer_id = ? ORDER BY ct.created_at DESC LIMIT 1`, [id]);
        return rows[0] || {};
    }

    static getCustomerTransactionByCustomerIdAndTimestamp = async (id, timestamp, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT ct.*, DATE_FORMAT(ct.created_at, '%d %b %Y, %h:%i:%s %p') as created_at, gp.package_name FROM customer_transactions ct JOIN girls_package gp ON ct.package_id = gp.id WHERE ct.customer_id = ? AND ct.created_at = ? ORDER BY ct.created_at DESC LIMIT 1`, [id, timestamp]);
        return rows[0] || {};
    }

    static getCustomerTransactionsTotalAmountById = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT SUM(earnings) AS total_amount FROM customer_transactions WHERE customer_id = ?", [id]);
        return rows[0] || 0;
    }

    static addCustomerTransaction = async (data, transaction = db) =>
    {
        const [result] = await transaction.query("INSERT INTO customer_transactions(customer_id, package_id, minutes, rate_per_minute, earnings, status ) VALUES ( ? , ? , ? , ? , ? , ?)", [data.customerId, data.packageId, data.minutes, data.rate, data.amount, data.status]);
        if (result.affectedRows > 0)
        {
            return this.getAllCustomerTransactionsById(data.customerId);
        }
        return false;
    }

    static editCustomerTransaction = async (data, transaction = db) =>
    {
        const [result] = await transaction.query("UPDATE customer_transactions SET customer_id = ?, package_id = ?, minutes = ?, rate_per_minute = ?, earnings = ?, status = ? where customer_id = ? AND created_at = ?", [data.customerId, data.packageId, data.minutes, data.rate, data.amount, data.status, data.customerId, data.createdAt]);
        if (result.affectedRows > 0)
        {
            return this.getCustomerTransactionByCustomerIdAndTimestamp(data.customerId, data.createdAt);
        }
        return false;
    }
}

export default customerTransactionsModel;