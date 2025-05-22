const pool = require('../db');

class DomainReservation {
  static async checkDomainAvailability(domainName) {
    const [rows] = await pool.query(
      'SELECT id FROM domain_reservations WHERE domain_name = ? AND status != "rejected"',
      [domainName]
    );
    return rows.length === 0;
  }

  static async create(
    userId,
    domainName,
    offerId,
    hostingOfferId,
    technologies,
    projectType,
    hostingNeeded,
    additionalServices,
    preferredContactMethod,
    projectDeadline,
    budgetRange,
    paymentStatus = 'unpaid'
  ) {
    const [result] = await pool.query(
      'INSERT INTO domain_reservations (user_id, domain_name, offer_id, hosting_offer_id, technologies, project_type, hosting_needed, additional_services, preferred_contact_method, project_deadline, budget_range, payment_status, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending", NOW())',
      [
        userId,
        domainName,
        offerId,
        hostingOfferId,
        technologies,
        projectType,
        hostingNeeded,
        additionalServices,
        preferredContactMethod,
        projectDeadline,
        budgetRange,
        paymentStatus,
      ]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT dr.*, o.name AS offer_name, o.duration_months, o.price, o.description, o.features, o.domain_type, ho.name AS hosting_offer_name, ho.storage_space, ho.bandwidth, ho.price AS hosting_price, u.nom, u.prenom, u.email, u.phone AS client_phone FROM domain_reservations dr JOIN offers o ON dr.offer_id = o.id LEFT JOIN offers ho ON dr.hosting_offer_id = ho.id LEFT JOIN users u ON dr.user_id = u.id WHERE dr.id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await pool.query(
      'SELECT dr.*, o.name AS offer_name, o.duration_months, o.price, o.description, o.features, o.domain_type, ho.name AS hosting_offer_name, ho.storage_space, ho.bandwidth, ho.price AS hosting_price FROM domain_reservations dr JOIN offers o ON dr.offer_id = o.id LEFT JOIN offers ho ON dr.hosting_offer_id = ho.id WHERE dr.user_id = ?',
      [userId]
    );
    return rows;
  }

  static async findAll() {
    const [rows] = await pool.query(
      'SELECT dr.*, o.name AS offer_name, o.duration_months, o.price, o.description, o.features, o.domain_type, ho.name AS hosting_offer_name, ho.storage_space, ho.bandwidth, ho.price AS hosting_price, u.nom, u.prenom, u.email, u.phone AS client_phone FROM domain_reservations dr JOIN offers o ON dr.offer_id = o.id LEFT JOIN offers ho ON dr.hosting_offer_id = ho.id LEFT JOIN users u ON dr.user_id = u.id'
    );
    return rows;
  }

  static async update(
    id,
    domainName,
    offerId,
    hostingOfferId,
    technologies,
    projectType,
    hostingNeeded,
    additionalServices,
    preferredContactMethod,
    projectDeadline,
    budgetRange,
    paymentStatus
  ) {
    await pool.query(
      'UPDATE domain_reservations SET domain_name = ?, offer_id = ?, hosting_offer_id = ?, technologies = ?, project_type = ?, hosting_needed = ?, additional_services = ?, preferred_contact_method = ?, project_deadline = ?, budget_range = ?, payment_status = ?, updated_at = NOW() WHERE id = ?',
      [
        domainName,
        offerId,
        hostingOfferId,
        technologies,
        projectType,
        hostingNeeded,
        additionalServices,
        preferredContactMethod,
        projectDeadline,
        budgetRange,
        paymentStatus,
        id,
      ]
    );
  }

  static async updateStatus(id, status) {
    await pool.query(
      'UPDATE domain_reservations SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );
  }

  static async updatePaymentStatus(id, paymentStatus) {
    await pool.query(
      'UPDATE domain_reservations SET payment_status = ?, updated_at = NOW() WHERE id = ?',
      [paymentStatus, id]
    );
  }

  static async updateDeployedUrl(id, deployedUrl) {
    await pool.query(
      'UPDATE domain_reservations SET deployed_url = ?, updated_at = NOW() WHERE id = ?',
      [deployedUrl, id]
    );
  }

  static async delete(id) {
    await pool.query('DELETE FROM domain_reservations WHERE id = ?', [id]);
  }
}

module.exports = DomainReservation;