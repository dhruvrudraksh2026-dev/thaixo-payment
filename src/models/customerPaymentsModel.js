// +---------------------+------------------------------------+------+-----+-------------------+-----------------------------------------------+
// | Field               | Type                               | Null | Key | Default           | Extra                                         |
// +---------------------+------------------------------------+------+-----+-------------------+-----------------------------------------------+
// | id                  | int                                | NO   | PRI | NULL              | auto_increment                                |
// | customer_id         | int                                | NO   | MUL | NULL              |                                               |
// | razorpay_order_id   | varchar(255)                       | YES  |     | NULL              |                                               |
// | razorpay_payment_id | varchar(255)                       | YES  |     | NULL              |                                               |
// | razorpay_signature  | varchar(255)                       | YES  |     | NULL              |                                               |
// | receipt             | varchar(255)                       | YES  |     | NULL              |                                               |
// | package_id          | int                                | YES  |     | NULL              |                                               |
// | package_name        | varchar(150)                       | YES  |     | NULL              |                                               |
// | amount              | decimal(10,2)                      | YES  |     | NULL              |                                               |
// | coins               | decimal(10,2)                      | YES  |     | NULL              |                                               |
// | bonus_coins         | decimal(10,2)                      | YES  |     | NULL              |                                               |
// | status              | enum('CREATED','SUCCESS','FAILED') | YES  |     | CREATED           |                                               |
// | created_at          | datetime                           | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
// | updated_at          | datetime                           | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
// +---------------------+------------------------------------+------+-----+-------------------+-----------------------------------------------+
import db from "../../config/db.js";

class customerPaymentsModel
{
    static getAllCustomerPayments = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT cp.*, c.name as customer_name FROM customer_payments cp LEFT JOIN customer c ON cp.customer_id = c.id ORDER BY cp.created_at DESC`);
        return rows;
    }

    static getAllCustomerPaymentsTotalAmount = async (transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT SUM(amount) as total_amount FROM customer_payments WHERE status = 'SUCCESS'`);
        return rows[0];
    }

    static getCustomerPaymentById = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT * FROM customer_payments WHERE id = ?`, [id]);
        return rows[0];
    }

    static getCustomerPaymentByOrderId = async (order_id, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT * FROM customer_payments WHERE razorpay_order_id = ?`, [order_id]);
        return rows[0];
    }

    static createCustomerPayment = async (data, transaction = db) =>
    {
        const [result] = await transaction.query(`INSERT INTO customer_payments( customer_id , razorpay_order_id , receipt , package_id , package_name , amount , coins , bonus_coins , status ) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? , ? ) `, [data.customer_id, data.razorpay_order_id, data.receipt, data.package_id, data.package_name, data.amount, data.coins, data.bonus_coins, data.status]);

        if (result.affectedRows > 0)
        {
            return await this.getCustomerPaymentById(result.insertId, transaction);
        }
        return false;
    }

    static updateCustomerPaymentByOrderId = async (data, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE customer_payments SET razorpay_payment_id = ? , razorpay_signature = ? , status = ? WHERE razorpay_order_id = ? `, [data.razorpay_payment_id, data.razorpay_signature, data.status, data.razorpay_order_id]);

        if (result.affectedRows > 0)
        {
            return await this.getCustomerPaymentByOrderId(data.razorpay_order_id, transaction);
        }
        return false;
    }

    static deleteCustomerPayment = async (id, transaction = db) =>
    {
        const [result] = await transaction.query(`DELETE FROM customer_payments WHERE id = ?`, [id]);
        if (result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }

    static updateCustomerPaymentStatus = async (data, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE customer_payments SET status = ? WHERE id = ? `, [data.status, data.id]);
        if (result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }
}

export default customerPaymentsModel;