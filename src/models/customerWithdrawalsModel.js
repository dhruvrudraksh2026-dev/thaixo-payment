import db from "../../config/db.js";

class customerWithdrawalsModel
{
    // For Customer Withdrawals Page - All
    static getAllCustomerWithdrawals = async (transaction = db) =>
    {
        // Fetching Withdrawals With Package Details
        const [rows] = await transaction.query("SELECT cw.*, c.name AS customer_name, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw LEFT JOIN customer c ON cw.customer_id = c.id order by cw.created_at DESC");
        return rows;
    }

    // For Pending Customer Withdrawals Page
    static getAllPendingCustomerWithdrawals = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`
        SELECT 
            cw.*,
            c.name AS customer_name,
            DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') AS created_at

        FROM customer_withdrawals cw
        LEFT JOIN customer c 
            ON cw.customer_id = c.id

        WHERE cw.status = 'PENDING'

        AND NOT EXISTS (
            SELECT 1
            FROM customer_agency ca
            WHERE ca.customer_id = cw.customer_id
        )

        ORDER BY cw.created_at DESC
    `);
        return rows;
    }

    // For Agency Info Page - Agency Customer Withdrawals
    static getAllPendingAgencyCustomerWithdrawalsByAgencyId = async (agencyId, transaction = db) =>
    {
        const [rows] = await transaction.query(`
        SELECT 
            cw.*,
            c.name AS customer_name,
            DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') AS created_at

        FROM customer_withdrawals cw

        INNER JOIN customer_agency ca 
            ON ca.customer_id = cw.customer_id

        LEFT JOIN customer c 
            ON cw.customer_id = c.id

        WHERE ca.agency_id = ?
        AND cw.status IN ('PENDING','CANCELLED')

        ORDER BY cw.created_at DESC
    `, [agencyId]);
        return rows;
    }

    static getCustomerWithdrawalsPaidAmountByCustomerId = async (customerId, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT SUM(withdrawal_amount) as total_paid FROM customer_withdrawals WHERE customer_id = ? AND status = "DONE"`, [customerId]);
        return rows[0] || 0;
    }

    static getCustomerWithdrawalsPendingAmountByCustomerId = async (customerId, transaction = db) =>
    {
        const [rows] = await transaction.query(`
            SELECT
                IFNULL(SUM(ct.earnings),0) 
                -
                IFNULL((
                    SELECT SUM(withdrawal_amount)
                    FROM customer_withdrawals
                    WHERE customer_id = ?
                    AND status = "DONE"
                ),0) AS total_pending

            FROM customer_transactions ct
            WHERE ct.customer_id = ?;
        `, [customerId, customerId, customerId]);
        return rows[0] || 0;
    }

    // #1
    static getCustomerEarningsStats = async (customerId, transaction = db) =>
    {
        const [rows] = await transaction.query(`
            SELECT
                IFNULL(SUM(ct.earnings),0) AS total_earnings,

                IFNULL((
                    SELECT SUM(withdrawal_amount)
                    FROM customer_withdrawals
                    WHERE customer_id = ?
                    AND status = "DONE"
                ),0) AS total_paid,

                IFNULL(SUM(ct.earnings),0) 
                -
                IFNULL((
                    SELECT SUM(withdrawal_amount)
                    FROM customer_withdrawals
                    WHERE customer_id = ?
                    AND status = "DONE"
                ),0) AS total_pending

            FROM customer_transactions ct
            WHERE ct.customer_id = ?;
        `, [customerId, customerId, customerId]);
        return rows[0] || 0;
    }

    static getCustomerWithdrawalsByCustomerId = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT cw.*, c.name as customer_name, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw LEFT JOIN customer c ON cw.customer_id = c.id WHERE cw.customer_id = ?", [id]);
        return rows;
    }

    // For Pending Customer Withdrawals Page
    static getCustomerWithdrawalTotalPendingAmount = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`
        SELECT SUM(cw.withdrawal_amount) AS total_pending
        FROM customer_withdrawals cw
        WHERE cw.status = 'PENDING'

        AND NOT EXISTS (
            SELECT 1
            FROM customer_agency ca
            WHERE ca.customer_id = cw.customer_id
        )
    `);

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

    // For Customer Withdrawals Page - All
    static getAllCustomerWithdrawalsByDateRange = async (data, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT cw.*, c.name as customer_name, DATE_FORMAT(cw.created_at, '%d %b %Y, %h:%i:%s %p') as created_at FROM customer_withdrawals cw LEFT JOIN customer c ON cw.customer_id = c.id WHERE cw.created_at BETWEEN ? AND ?", [data.startDate, data.endDate]);
        return rows;
    }

    // For Customer Withdrawals Page - All
    static getAllCustomerWithdrawalsTotalAmountByDateRange = async (data, transaction = db) =>
    {
        const [rows] = await transaction.query("SELECT SUM(withdrawal_amount) as total_amount FROM customer_withdrawals WHERE status IN ('DONE','PENDING') AND created_at BETWEEN ? AND ?", [data.startDate, data.endDate]);
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

    // Updated Logic
    // static insertLastMonthsWithdrawals = async (transaction = db) =>
    // {
    //     const [rows] = await transaction.query(`
    //         INSERT INTO customer_withdrawals
    //         (customer_id, method, withdrawal_amount, payout_details, status, created_at)

    //         SELECT 
    //             c.id,
    //             'Bank',

    //             (
    //                 COALESCE(SUM(ct.earnings),0)
    //                 -
    //                 COALESCE((
    //                     SELECT SUM(cw.withdrawal_amount)
    //                     FROM customer_withdrawals cw
    //                     WHERE cw.customer_id = c.id
    //                     AND cw.status IN ('DONE','PENDING')
    //                 ),0)
    //             ) AS withdrawable_amount,

    //             c.customer_legal_details,
    //             'PENDING',
    //             NOW()

    //         FROM customer c
    //         LEFT JOIN customer_transactions ct 
    //             ON ct.customer_id = c.id

    //         WHERE
    //             c.suspended = 0
    //             AND c.is_creator = 1
    //             AND c.is_verified = 1
    //             AND c.is_legal_details_verified = 1

    //             AND NOT EXISTS (
    //                 SELECT 1
    //                 FROM customer_agency ca
    //                 WHERE ca.customer_id = c.id
    //             )

    //         GROUP BY c.id

    //         HAVING withdrawable_amount > 1000;
    //     `);
    //     console.log("Normal Creators", rows);
    //     return rows;
    // }

    // Updated Logic
    // static insertLastMonthsWithdrawalsForAgencies = async (transaction = db) =>
    // {
    //     const [rows] = await transaction.query(`
    //     INSERT INTO customer_withdrawals
    //     (customer_id, method, withdrawal_amount, payout_details, status, created_at)

    //     SELECT 
    //         c.id,
    //         'Via Agency',

    //         (
    //             COALESCE(SUM(ct.earnings),0)
    //             -
    //             COALESCE((
    //                 SELECT SUM(cw.withdrawal_amount)
    //                 FROM customer_withdrawals cw
    //                 WHERE cw.customer_id = c.id
    //                 AND cw.status IN ('DONE','PENDING')
    //             ),0)
    //         ) AS withdrawable_amount,

    //         c.customer_legal_details,
    //         'PENDING',
    //         NOW()

    //     FROM customer c

    //     JOIN customer_agency ca
    //         ON ca.customer_id = c.id

    //     LEFT JOIN customer_transactions ct
    //         ON ct.customer_id = c.id

    //     WHERE
    //         c.suspended = 0
    //         AND c.is_creator = 1
    //         AND c.is_verified = 1

    //         -- prevent duplicate pending withdrawals
    //         AND NOT EXISTS (
    //             SELECT 1
    //             FROM customer_withdrawals cw
    //             WHERE cw.customer_id = c.id
    //             AND cw.status = 'PENDING'
    //         )

    //     GROUP BY c.id

    //     HAVING withdrawable_amount > 1000
    // `);

    //     console.log("Agency Creators", rows);
    //     return rows;
    // }

    // Single Query For Both Normal And Agency Creators
    static insertLastMonthsWithdrawals = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`
        INSERT INTO customer_withdrawals
        (customer_id, method, withdrawal_amount, payout_details, status, created_at)

        SELECT 
            c.id,

            CASE 
                WHEN ca.customer_id IS NOT NULL THEN 'Via Agency'
                ELSE 'Bank'
            END AS method,

            (
                COALESCE(SUM(ct.earnings),0)
                -
                COALESCE((
                    SELECT SUM(cw.withdrawal_amount)
                    FROM customer_withdrawals cw
                    WHERE cw.customer_id = c.id
                    AND cw.status IN ('DONE','PENDING')
                ),0)
            ) AS withdrawable_amount,

            c.customer_legal_details,
            'PENDING',
            NOW()

        FROM customer c

        LEFT JOIN customer_transactions ct
            ON ct.customer_id = c.id

        LEFT JOIN customer_agency ca
            ON ca.customer_id = c.id

        WHERE
            c.suspended = 0
            AND c.is_creator = 1
            AND c.is_verified = 1

            -- legal verification required only for non-agency creators
            AND (
                ca.customer_id IS NOT NULL
                OR c.is_legal_details_verified = 1
            )

            -- prevent duplicate pending withdrawals
            AND NOT EXISTS (
                SELECT 1
                FROM customer_withdrawals cw
                WHERE cw.customer_id = c.id
                AND cw.status = 'PENDING'
            )

        GROUP BY c.id

        HAVING withdrawable_amount > 1000;
    `);

        console.log("Creators", rows);
        return rows;
    }
}

export default customerWithdrawalsModel;