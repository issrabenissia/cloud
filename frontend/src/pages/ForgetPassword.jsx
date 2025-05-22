import React, { useState } from 'react';
import backgroundImage from '../assets/images/bg-01.jpg';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de l\'envoi du lien.');
    }
  };

  return (
    <>
      <div className="preloader">
        <p>Chargement...</p>
      </div>

      <div className="limiter">
        <div
          className="container-login100"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
            <form className="login100-form validate-form" onSubmit={handleSubmit}>
              <span className="login100-form-title p-b-49">Mot de passe oublié</span>

              {message && <p className="text-center">{message}</p>}

              <div className="wrap-input100 validate-input m-b-23" data-validate="L'email est requis">
                <span className="label-input100">Email</span>
                <input
                  className="input100"
                  type="email"
                  name="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="focus-input100" data-symbol=""></span>
              </div>

              <div className="container-login100-form-btn">
                <div className="wrap-login100-form-btn">
                  <div className="login100-form-bgbtn"></div>
                  <button className="login100-form-btn" type="submit">
                    Envoyer le lien
                  </button>
                </div>
              </div>

              <div className="flex-col-c p-t-155">
                <a href="/login" className="txt2">
                  Retour à la connexion
                </a>
              </div>
            </form>
          </div>
        </div>
        <div id="dropDownSelect1"></div>
      </div>
    </>
  );
};

export default ForgotPassword;