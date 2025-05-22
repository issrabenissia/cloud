const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const authController = {
  register: async (req, res) => {
    const { nom, prenom, email, mot_de_passe, phone } = req.body;
    try {
      console.log('Register attempt:', { nom, prenom, email, phone });
      const existingUser = await User.findByEmail(email);
      console.log('Existing user check:', existingUser);
      if (existingUser) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      // Validate phone number format
      if (!phone || !/^\+216\d{8}$/.test(phone)) {
        return res.status(400).json({ message: 'Numéro de téléphone tunisien invalide (doit commencer par +216 suivi de 8 chiffres).' });
      }
      await User.createUser(nom, prenom, email, mot_de_passe, phone, 'client');
      res.status(201).json({ message: 'Client ajouté avec succès !' });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', {
        message: error.message,
        stack: error.stack,
        body: req.body,
      });
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  login: async (req, res) => {
    const { email, mot_de_passe } = req.body;
    try {
      console.log('Login attempt:', { email, mot_de_passe });
      if (!email || !mot_de_passe) {
        console.log('Missing email or password:', { email, mot_de_passe });
        return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
      }

      console.log('Querying user by email:', email);
      const user = await User.findByEmail(email);
      console.log('User query result:', user);

      if (!user) {
        console.log('User not found:', email);
        return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
      }

      console.log('Comparing password for user:', email);
      const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
      console.log('Password match result:', isMatch);

      if (!isMatch) {
        console.log('Invalid password for user:', email);
        return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
      }

      console.log('Generating JWT for user:', user.id);
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      console.log('Login successful, token generated:', token);

      res.status(200).json({
        message: 'Connexion réussie !',
        token,
        user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage || 'N/A',
        stack: error.stack,
        body: req.body,
      });
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      console.log('Forgot password request for:', email);
      const user = await User.findByEmail(email);
      console.log('User found:', user);
      if (!user) return res.status(400).json({ message: "Cet email n'existe pas." });
      const token = crypto.randomBytes(20).toString('hex');
      const expires = new Date(Date.now() + 3600000);
      const formattedExpires = expires.toISOString().slice(0, 19).replace('T', ' ');
      console.log('Creating reset token:', { token, expires: formattedExpires });
      await User.createResetToken(email, token, formattedExpires);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      console.log('Sending reset email to:', email, 'with link:', resetLink);
      await transporter.sendMail({
        from: `"Réinitialisation" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
        html: `<p>Cliquez sur ce <a href="${resetLink}">lien</a> pour réinitialiser votre mot de passe.</p>`,
      });
      res.status(200).json({ message: 'Un lien de réinitialisation a été envoyé à votre email.' });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', {
        message: error.message,
        stack: error.stack,
        body: req.body,
      });
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  resetPassword: async (req, res) => {
    const { token, mot_de_passe } = req.body;
    try {
      console.log('Reset password attempt with token:', token);
      const resetToken = await User.findResetToken(token);
      console.log('Reset token found:', resetToken);
      if (!resetToken || new Date() > new Date(resetToken.expires_at)) {
        console.log('Invalid or expired reset token:', token);
        return res.status(400).json({ message: 'Lien de réinitialisation invalide ou expiré.' });
      }
      console.log('Updating password for email:', resetToken.email);
      await User.updatePassword(resetToken.email, mot_de_passe);
      console.log('Deleting reset token:', token);
      await User.deleteResetToken(token);
      res.status(200).json({ message: 'Mot de passe réinitialisé avec succès !' });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', {
        message: error.message,
        stack: error.stack,
        body: req.body,
      });
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  contact: async (req, res) => {
    const { name, email, phone, company, message } = req.body;
    try {
      console.log('Contact form submission:', { name, email, phone, company, message });
      if (!name || !email || !message) {
        console.log('Missing required fields in contact form:', { name, email, message });
        return res.status(400).json({ message: 'Les champs nom, email et message sont requis.' });
      }
      await User.saveContactMessage(name, email, phone, company, message);
      console.log('Contact message saved successfully');
      res.status(200).json({ message: 'Message envoyé avec succès !' });
    } catch (error) {
      console.error('Erreur dans contact:', {
        message: error.message,
        stack: error.stack,
        body: req.body,
      });
      res.status(500).json({ message: 'Erreur serveur lors de l’envoi du message.' });
    }
  },
};

module.exports = authController;