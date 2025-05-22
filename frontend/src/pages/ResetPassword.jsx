import React, { useState } from 'react';
import backgroundImage from '../assets/images/bg-01.jpg';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Ajout de Link pour navigation



const ResetPassword = () => {
  const { token } = useParams(); // Récupère le token depuis l'URL
  const [formData, setFormData] = useState({
    mot_de_passe: '',
    confirm_mot_de_passe: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mot_de_passe !== formData.confirm_mot_de_passe) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        token,
        mot_de_passe: formData.mot_de_passe,
      });
      setMessage(response.data.message);
      setFormData({ mot_de_passe: '', confirm_mot_de_passe: '' }); // Réinitialiser les champs
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la réinitialisation.');
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
              <span className="login100-form-title p-b-49">
                Réinitialiser le mot de passe
              </span>

              {message && (
                <p
                  className={`text-center p-b-20 ${
                    message.includes('succès') ? 'text-success' : 'text-danger'
                  }`}
                >
                  {message}
                </p>
              )}

              <div
                className="wrap-input100 validate-input m-b-23"
                data-validate="Le mot de passe est requis"
              >
                <span className="label-input100">Nouveau mot de passe</span>
                <input
                  className="input100"
                  type="password"
                  name="mot_de_passe"
                  placeholder="Entrez votre nouveau mot de passe"
                  value={formData.mot_de_passe}
                  onChange={handleChange}
                  required
                />
                <span className="focus-input100" data-symbol=""></span>
              </div>

              <div
                className="wrap-input100 validate-input m-b-23"
                data-validate="Confirmez votre mot de passe"
              >
                <span className="label-input100">Confirmer le mot de passe</span>
                <input
                  className="input100"
                  type="password"
                  name="confirm_mot_de_passe"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirm_mot_de_passe}
                  onChange={handleChange}
                  required
                />
                <span className="focus-input100" data-symbol=""></span>
              </div>

              <div className="container-login100-form-btn">
                <div className="wrap-login100-form-btn">
                  <div className="login100-form-bgbtn"></div>
                  <button className="login100-form-btn" type="submit">
                    Réinitialiser
                  </button>
                </div>
              </div>

              <div className="txt1 text-center p-t-54 p-b-20">
                <span>Ou</span>
              </div>

              <div className="flex-c-m">
                <Link to="/login" className="login100-social-item bg1">
                  <i className="fa fa-sign-in-alt"></i>
                </Link>
                <Link to="/inscription" className="login100-social-item bg2">
                  <i className="fa fa-user-plus"></i>
                </Link>
              </div>

              <div className="flex-col-c p-t-25">
                <Link to="/login" className="txt2">
                  Retour à la connexion
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div id="dropDownSelect1"></div>
      </div>
    </>
  );
};

export default ResetPassword;