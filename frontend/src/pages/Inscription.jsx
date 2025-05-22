import React, { useState } from 'react';
import backgroundImage from '../assets/images/bg-01.jpg';
import axios from 'axios';

const Inscription = () => {
    const [formData, setFormData] = useState({
      nom: '',
      prenom: '',
      email: '',
      mot_de_passe: '',
      phone: '+216', // Default to Tunisia country code
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
      const { name, value } = e.target;
      // Ensure phone starts with +216
      if (name === 'phone') {
        if (!value.startsWith('+216')) {
          return; // Prevent changing the country code
        }
      }
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      // Validate phone number (basic check for E.164 format with +216)
      if (!/^\+216\d{8}$/.test(formData.phone)) {
        setMessage('Veuillez entrer un numéro de téléphone tunisien valide (8 chiffres après +216).');
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/api/inscription', formData);
        setMessage(response.data.message);
        setFormData({ nom: '', prenom: '', email: '', mot_de_passe: '', phone: '+216' }); // Reset form
      } catch (error) {
        setMessage(error.response?.data?.message || 'Erreur lors de l\'inscription.');
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
                <span className="login100-form-title p-b-49">Inscription</span>

                {message && <p className="text-center">{message}</p>}

                <div className="wrap-input100 validate-input m-b-23" data-validate="Le nom est requis">
                  <span className="label-input100">Nom</span>
                  <input
                    className="input100"
                    type="text"
                    name="nom"
                    placeholder="Entrez votre nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                  <span className="focus-input100" data-symbol=""></span>
                </div>

                <div className="wrap-input100 validate-input m-b-23" data-validate="Le prénom est requis">
                  <span className="label-input100">Prénom</span>
                  <input
                    className="input100"
                    type="text"
                    name="prenom"
                    placeholder="Entrez votre prénom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />
                  <span className="focus-input100" data-symbol=""></span>
                </div>

                <div className="wrap-input100 validate-input m-b-23" data-validate="L'email est requis">
                  <span className="label-input100">Email</span>
                  <input
                    className="input100"
                    type="email"
                    name="email"
                    placeholder="Entrez votre email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <span className="focus-input100" data-symbol=""></span>
                </div>

                <div className="wrap-input100 validate-input m-b-23" data-validate="Le numéro de téléphone est requis">
                  <span className="label-input100">Numéro de téléphone</span>
                  <input
                    className="input100"
                    type="tel"
                    name="phone"
                    placeholder="Entrez votre numéro (+216XXXXXXXX)"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <span className="focus-input100" data-symbol=""></span>
                </div>

                <div className="wrap-input100 validate-input" data-validate="Le mot de passe est requis">
                  <span className="label-input100">Mot de passe</span>
                  <input
                    className="input100"
                    type="password"
                    name="mot_de_passe"
                    placeholder="Entrez votre mot de passe"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    required
                  />
                  <span className="focus-input100" data-symbol=""></span>
                </div>

                <div className="text-right p-t-8 p-b-31">
                  <a href="/forgot-password">Mot de passe oublié ?</a>
                </div>

                <div className="container-login100-form-btn">
                  <div className="wrap-login100-form-btn">
                    <div className="login100-form-bgbtn"></div>
                    <button className="login100-form-btn" type="submit">
                      S'inscrire
                    </button>
                  </div>
                </div>

                <div className="txt1 text-center p-t-54 p-b-20">
                  <span>Ou s'inscrire avec</span>
                </div>

                <div className="flex-c-m">
                  <a href="#" className="login100-social-item bg1">
                    <i className="fa fa-facebook"></i>
                  </a>
                  <a href="#" className="login100-social-item bg2">
                    <i className="fa fa-twitter"></i>
                  </a>
                  <a href="#" className="login100-social-item bg3">
                    <i className="fa fa-google"></i>
                  </a>
                </div>

                <div className="flex-col-c">
                  <span className="txt1 p-b-17">Déjà inscrit ?</span>
                  <a href="/login" className="txt2">
                    Se connecter
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

export default Inscription;