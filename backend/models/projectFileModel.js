// server/models/projectFileModel.js
const pool = require('../db');

class ProjectFile {
  static async create(reservationId, filePath, fileName) {
    const [result] = await pool.query(
      'INSERT INTO project_files (reservation_id, file_path, file_name) VALUES (?, ?, ?)',
      [reservationId, filePath, fileName]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM project_files WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByReservationId(reservationId) {
    const [rows] = await pool.query('SELECT * FROM project_files WHERE reservation_id = ?', [reservationId]);
    return rows;
  }

  static async delete(id) {
    await pool.query('DELETE FROM project_files WHERE id = ?', [id]);
  }
}

module.exports = ProjectFile;