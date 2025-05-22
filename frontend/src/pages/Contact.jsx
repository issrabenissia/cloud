import React, { useState } from 'react';
import axios from 'axios';
import '../contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Envoi en cours...');

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      setStatus(response.data.message);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (error) {
      setStatus(error.response?.data?.message || 'Erreur lors de l’envoi du message.');
    }
  };

  return (
    <div className="content">
      <div className="container">
        <div className="row align-items-stretch no-gutters contact-wrap">
          <div className="col-md-6">
            <div className="form h-100">
              <h3>Envoyez-nous un message</h3>
              <form className="mb-5" onSubmit={handleSubmit} id="contactForm">
                <div className="row">
                  <div className="col-md-6 form-group mb-5">
                    <label htmlFor="name" className="col-form-label">
                      Nom *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      id="name"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group mb-5">
                    <label htmlFor="email" className="col-form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="email"
                      placeholder="Votre email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group mb-5">
                    <label htmlFor="phone" className="col-form-label">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      id="phone"
                      placeholder="Numéro de téléphone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 form-group mb-5">
                    <label htmlFor="company" className="col-form-label">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="company"
                      id="company"
                      placeholder="Nom de l’entreprise"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 form-group mb-5">
                    <label htmlFor="message" className="col-form-label">
                      Message *
                    </label>
                    <textarea
                      className="form-control"
                      name="message"
                      id="message"
                      cols="30"
                      rows="4"
                      placeholder="Écrivez votre message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 form-group">
                    <input
                      type="submit"
                      value="Envoyer le message"
                      className="btn btn-primary rounded-0 py-2 px-4"
                    />
                    <span className="submitting">{status}</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div className="contact-map h-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d25622.519908668295!2d10.8677283!3d36.6067647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2stn!4v1741306547917!5m2!1sfr!2stn"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;