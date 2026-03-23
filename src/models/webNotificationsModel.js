// CREATE TABLE web_notifications (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     customer_id INT NOT NULL,
//     type VARCHAR(50) NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     body TEXT NOT NULL,
//     read_status BOOLEAN DEFAULT FALSE,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
// );

import db from "../../config/db.js";

class webNotificationsModel
{
    static getAllWebNotificationsByCustomerId = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT * FROM web_notifications WHERE customer_id = ? ORDER BY created_at DESC`, [id]);
        return rows;
    }

    static getWebNotificationById = async (id, transaction = db) =>
    {
        const [rows] = await transaction.query(`SELECT * FROM web_notifications WHERE id = ?`, [id]);
        return rows[0] || {};
    }

    static createWebNotification = async (data, transaction = db) =>
    {
        const [result] = await transaction.query(`INSERT INTO web_notifications (customer_id, type, title, body) VALUES (?, ?, ?, ?)`, [data.customer_id, data.type, data.title, data.body]);
        if (result.affectedRows > 0)
        {
            return await this.getWebNotificationById(result.insertId);
        }
        return false;
    }

    static markWebNotificationAsRead = async (id, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE web_notifications SET read_status = 1 WHERE id = ?`, [id]);
        if (result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }

    static markAllWebNotificationsAsRead = async (id, transaction = db) =>
    {
        const [result] = await transaction.query(`UPDATE web_notifications SET read_status = 1 WHERE customer_id = ?`, [id]);
        if (result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }

    static deleteWebNotification = async (id, transaction = db) =>
    {
        const [result] = await transaction.query(`DELETE FROM web_notifications WHERE id = ?`, [id]);
        if (result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }

    static deleteWebNotificationsByCustomerId = async (id, transaction = db) =>
    {
        const [result] = await transaction.query(`DELETE FROM web_notifications WHERE customer_id = ?`, [id]);
        if (result.affectedRows > 0)
        {
            return true;
        }
        return false;
    }
}

export default webNotificationsModel;