const pool = require('../db');
const bcrypt = require('bcrypt');

class User {
  static async findByEmail(email) {
    try {
      console.log('Executing query for email:', email);
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      console.log('Query result:', rows);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Database query error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }

  static async findById(id) {
    try {
      console.log('Executing query for id:', id);
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      console.log('Query result:', rows);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Database query error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }

  static async findAllClients() {
    try {
      console.log('Executing query for all clients');
      const [rows] = await pool.query(
        'SELECT id, nom, prenom, email, role FROM users WHERE role = "client"'
      );
      console.log('Query result:', rows);
      return rows;
    } catch (error) {
      console.error('Database query error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }

  static async createUser(nom, prenom, email, mot_de_passe, phone, role = 'client') {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
      console.log('Creating user with email:', email, 'phone:', phone);
      await pool.query(
        'INSERT INTO users (nom, prenom, email, mot_de_passe, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
        [nom, prenom, email, hashedPassword, phone, role]
      );
      console.log('User created successfully');
    } catch (error) {
      console.error('Create user error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }

  static async updateClient(id, nom, prenom, email, role) {
    try {
      console.log('Updating client with id:', id);
      await pool.query(
        'UPDATE users SET nom = ?, prenom = ?, email = ?, role = ? WHERE id = ?',
        [nom, prenom, email, role, id]
      );
      console.log('Client updated successfully');
    } catch (error) {
      console.error('Update client error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }

  static async deleteClient(id) {
    try {
      console.log('Deleting client with id:', id);
      await pool.query('DELETE FROM users WHERE id = ?', [id]);
      console.log('Client deleted successfully');
    } catch (error) {
      console.error('Delete client error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }

  static async createResetToken(email, token, expires) {
    try {
      console.log('Creating reset token for email:', email);
      await pool.query(
        'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
        [email, token, expires]
      );
      console.log('Reset token created successfully');
    } catch (error) {
      console.error('Create reset token error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }

  static async findResetToken(token) {
    try {
      console.log('Executing query for reset token:', token);
      const [rows] = await pool.query('SELECT * FROM password_resets WHERE token = ?', [token]);
      console.log('Query result:', rows);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Find reset token error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }

  static async deleteResetToken(token) {
    try {
      console.log('Deleting reset token:', token);
      await pool.query('DELETE FROM password_resets WHERE token = ?', [token]);
      console.log('Reset token deleted successfully');
    } catch (error) {
      console.error('Delete reset token error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }

  static async updatePassword(email, mot_de_passe) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
      console.log('Updating password for email:', email);
      await pool.query('UPDATE users SET mot_de_passe = ? WHERE email = ?', [hashedPassword, email]);
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Update password error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }

  static async saveContactMessage(name, email, phone, company, message) {
    try {
      console.log('Saving contact message for email:', email);
      await pool.query(
        'INSERT INTO contact_messages (name, email, phone, company, message) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || null, company || null, message]
      );
      console.log('Contact message saved successfully');
    } catch (error) {
      console.error('Save contact message error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
      });
      throw error;
    }
  }
}

module.exports = User;