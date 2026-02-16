import db from "../../config/db.js";

class customerTransactionsModel
{
    static getAllCustomerTransactionsById = async (id, transaction = db) =>
    {
        // Fetching Transactions With Package Details
        const [rows] = await transaction.query("SELECT ct.*, DATE_FORMAT(ct.created_at, '%d %b %Y, %h:%i:%s %p') as created_at, gp.package_name FROM customer_transactions ct JOIN girls_package gp ON ct.package_id = gp.id WHERE ct.customer_id=? order by ct.created_at DESC", [id]);
        return rows;
    }

    static getAllCustomerTransactionsByIdAndDateRange = async (data, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT ct.*, DATE_FORMAT(ct.created_at, '%d %b %Y, %h:%i:%s %p') as created_at, gp.package_name FROM customer_transactions ct JOIN girls_package gp ON ct.package_id = gp.id WHERE ct.customer_id = ? AND ct.created_at BETWEEN ? AND ? order by ct.created_at", [data.id, data.startDate, data.endDate]);
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

    static getCustomerEarningsTotalAmountById = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT SUM(earnings) as total_earnings FROM customer_transactions WHERE rate_per_minute != 0 AND minutes != 0 AND customer_id = ?", [id]);
        return rows[0] || {};
    }

    static getCustomerEarningsTotalAmountByDateRange = async (data, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT SUM(earnings) as total_earnings FROM customer_transactions WHERE rate_per_minute != 0 AND minutes != 0 AND (created_at BETWEEN ? AND ?) AND customer_id = ?;`, [data.startDate, data.endDate, data.id]);
        return rows[0] || {};
    }

    static getCustomerTransactionsTotalAmountById = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT SUM(earnings) AS total_amount FROM customer_transactions WHERE customer_id = ?", [id]);
        return rows[0] || 0;
    }
}

export default customerTransactionsModel;