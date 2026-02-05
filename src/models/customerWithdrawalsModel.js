import db from "../../config/db.js";

class customerWithdrawalsModel
{
    static getAllCustomerWithdrawals = async (transaction = db) =>
    {
        // Fetching Withdrawals With Package Details
        const [rows] = await transaction.query("SELECT cw.*, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw order by cw.created_at DESC");
        return rows;
    }

    static getAllPendingCustomerWithdrawals = async (transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT cw.*, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw WHERE cw.status = 'PENDING' order by cw.created_at DESC");
        return rows;
    }

    static getCustomerWithdrawalsPaidAmountByCustomerId = async (customerId, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT SUM(withdrawal_amount) as total_paid FROM customer_withdrawals WHERE customer_id = ? AND status = "DONE"`, [customerId]);
        return rows[0] || 0;
    }

    static getCustomerWithdrawalsPendingAmountByCustomerId = async (customerId, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT SUM(withdrawal_amount) as total_pending FROM customer_withdrawals WHERE customer_id = ? AND status = "PENDING"`, [customerId]);
        return rows[0] || 0;
    }

    static getCustomerWithdrawalsByCustomerId = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT cw.*, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw WHERE cw.customer_id = ?", [id]);
        return rows;
    }

    static getCustomerWithdrawalTotalPendingAmount = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT SUM(withdrawal_amount) as total_pending FROM customer_withdrawals WHERE status = "PENDING"`);
        return rows[0] || 0;
    }

    static getCustomerWithdrawalsByDateRangeByCustomerId = async (data, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT cw.*, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw WHERE cw.customer_id = ? AND cw.created_at BETWEEN ? AND ?", [data.customerId, data.startDate, data.endDate]);
        return rows;
    }

    static getCustomerWithdrawalsTotalAmountByDateRangeByCustomerId = async (data, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT SUM(withdrawal_amount) as withdrawal_amount FROM customer_withdrawals WHERE customer_id = ? AND created_at BETWEEN ? AND ?", [data.customerId, data.startDate, data.endDate]);
        return rows[0] || {};
    }

    static getCustomerWithdrawalByWithdrawalId = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT cw.*, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw WHERE cw.id = ?", [id]);
        return rows[0] || {};
    }

    static addCustomerWithdrawal = async (data, transaction = db) =>
    {
        const [result] = await transaction.query("INSERT INTO customer_withdrawals(customer_id, withdrawal_method, withdrawal_amount, payout_details, status) VALUES (?, ?, ?, ?, ?)", [data.customerId, data.withdrawalMethod, data.withdrawalAmount, JSON.stringify(data.payoutDetails), data.status]);
        if (result.affectedRows > 0)
        {
            return this.getCustomerWithdrawalByWithdrawalId(result.insertId);
        }
        return false;
    }

    static editCustomerWithdrawal = async (data, transaction = db) =>
    {
        const [result] = await transaction.query("UPDATE customer_withdrawals SET customer_id = ?, withdrawal_method = ?, withdrawal_amount = ?, payout_details = ?, status = ? where id = ?", [data.customerId, data.withdrawalMethod, data.withdrawalAmount, JSON.stringify(data.payoutDetails), data.status, data.id]);
        if (result.affectedRows > 0)
        {
            return this.getCustomerWithdrawalByWithdrawalId(data.id);
        }
        return false;
    }

    static deleteCustomerWithdrawal = async (id, transaction = db) =>
    {
        const [result] = await transaction.query("DELETE FROM customer_withdrawals WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

export default customerWithdrawalsModel;