// server/models/offerModel.js
const pool = require('../db');

class Offer {
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM offers WHERE id = ?', [id]);
    return rows[0];
  }

  static async findAll(type = null) {
    let query = 'SELECT * FROM offers';
    const params = [];
    if (type) {
      query += ' WHERE offer_type = ?';
      params.push(type);
    }
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async create(name, duration_months, price, description, features, domain_type, offer_type, storage_space, bandwidth) {
    const [result] = await pool.query(
      'INSERT INTO offers (name, duration_months, price, description, features, domain_type, offer_type, storage_space, bandwidth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, duration_months, price, description, features, domain_type, offer_type, storage_space, bandwidth]
    );
    return result.insertId;
  }

  static async update(id, name, duration_months, price, description, features, domain_type, offer_type, storage_space, bandwidth) {
    await pool.query(
      'UPDATE offers SET name = ?, duration_months = ?, price = ?, description = ?, features = ?, domain_type = ?, offer_type = ?, storage_space = ?, bandwidth = ?, updated_at = NOW() WHERE id = ?',
      [name, duration_months, price, description, features, domain_type, offer_type, storage_space, bandwidth, id]
    );
  }

  static async delete(id) {
    await pool.query('DELETE FROM offers WHERE id = ?', [id]);
  }
}

module.exports = Offer;