import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/bg-01.jpg';

// Determine the API URL based on the environment
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://hostify-zvms.onrender.com/api' 
  : 'http://localhost:5000/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submitted:', formData);
  try {
    console.log('Submitting login request to:', `${API_URL}/login`, formData);
    const response = await axios.post(`${API_URL}/login`, formData);
    console.log('Login response:', response.data);
    setMessage(response.data.message);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token); // Ajouter cette ligne pour stocker le token
    if (response.data.user.role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/home');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    setMessage(error.response?.data?.message || 'Erreur lors de la connexion.');
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
              <span className="login100-form-title p-b-49">Connexion</span>

              {message && <p className="text-center">{message}</p>}

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
                    Se connecter
                  </button>
                </div>
              </div>

              <div className="txt1 text-center p-t-54 p-b-20">
                <span>Ou se connecter avec</span>
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
                <span className="txt1 p-b-17">Pas encore inscrit ?</span>
                <a href="/register" className="txt2">
                  S'inscrire
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

export default Login;