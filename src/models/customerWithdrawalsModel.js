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
        const [rows] = await transaction.query("SELECT cw.*,c.name as customer_name, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw LEFT JOIN customer c ON cw.customer_id = c.id WHERE cw.status = 'PENDING' order by cw.created_at DESC");
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
        const [rows] = await transaction.query("SELECT cw.*, c.name as customer_name, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw LEFT JOIN customer c ON cw.customer_id = c.id WHERE cw.customer_id = ?", [id]);
        return rows;
    }

    static getCustomerWithdrawalTotalPendingAmount = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT SUM(withdrawal_amount) as total_pending FROM customer_withdrawals WHERE status = "PENDING"`);
        return rows[0] || 0;
    }

    // static getThisMonthsCustomerWithdrawalsAmount = async (transaction = db) =>
    // {
    //     const [rows] = await transaction.query(`SELECT SUM(withdrawal_amount) as total_amount FROM customer_withdrawals WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`);
    //     return rows[0] || 0;
    // }

    // static getThisMonthCustomerWithdrawalsTotalAmount = async (transaction = db) =>
    // {
    //     const [rows] = await transaction.query(`SELECT SUM(withdrawal_amount) as total_amount FROM customer_withdrawals WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')`);
    //     return rows[0] || 0;
    // }

    static getAllCustomerWithdrawalsByDateRange = async (data, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT cw.*, c.name as customer_name, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw LEFT JOIN customer c ON cw.customer_id = c.id WHERE cw.created_at BETWEEN ? AND ?", [data.startDate, data.endDate]);
        return rows;
    }

    static getAllCustomerWithdrawalsTotalAmountByDateRange = async (data, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT SUM(withdrawal_amount) as total_amount FROM customer_withdrawals WHERE created_at BETWEEN ? AND ?", [data.startDate, data.endDate]);
        return rows[0] || {};
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
        const [rows] = await transaction.query("SELECT cw.*, c.name as customer_name, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw LEFT JOIN customer c ON cw.customer_id = c.id WHERE cw.id = ?", [id]);
        return rows[0] || {};
    }

    static addCustomerWithdrawal = async (data, transaction = db) =>
    {
        const [result] = await transaction.query("INSERT INTO customer_withdrawals(customer_id, method, withdrawal_amount, payout_details, status , note) VALUES (?, ? , ?, ?, ? , ?)", [data.customerId, data.method, data.withdrawalAmount, JSON.stringify(data.payoutDetails), data.status, data.note]);
        if (result.affectedRows > 0)
        {
            return this.getCustomerWithdrawalByWithdrawalId(result.insertId);
        }
        return false;
    }

    static editCustomerWithdrawal = async (data, transaction = db) =>
    {
        const [result] = await transaction.query("UPDATE customer_withdrawals SET customer_id = ?, method = ?, withdrawal_amount = ?, payout_details = ?, status = ?, note = ? where id = ?", [data.customerId, data.method, data.withdrawalAmount, JSON.stringify(data.payoutDetails), data.status, data.note, data.id]);
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

    static updateCustomerWithdrawalStatus = async (id, status, transaction = db) =>
    {
        const [result] = await transaction.query("UPDATE customer_withdrawals SET status = ? where id = ?", [status, id]);
        return result.affectedRows > 0;
    }

    static updateSelectedCustomerWithdrawalStatus = async (data, transaction = db) =>
    {
        const [result] = await transaction.query("UPDATE customer_withdrawals SET status = ? , note = ? WHERE id IN ( ? )", [data.status, data.note, data.ids]);
        return result.affectedRows > 0;
    }

    static insertLastMonthsWithdrawals = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`
            INSERT INTO customer_withdrawals
            (customer_id, method, withdrawal_amount, payout_details, status, created_at)

            SELECT 
                ct.customer_id,
                'BANK',
                SUM(ct.earnings),
                c.customer_legal_details,
                'PENDING',
                DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')

            FROM customer_transactions ct
            JOIN customer c ON c.id = ct.customer_id

            WHERE 
                ct.created_at >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
                AND ct.created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')

                AND c.suspended = 0
                AND c.is_creator = 1
                AND c.is_verified = 1

                AND NOT EXISTS (
                    SELECT 1 
                    FROM customer_withdrawals cw
                    WHERE cw.customer_id = ct.customer_id
                    AND cw.created_at = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
                )

            GROUP BY ct.customer_id;
        `);
        return rows;
    }
}

export default customerWithdrawalsModel;