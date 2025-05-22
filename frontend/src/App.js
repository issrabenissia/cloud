// client/src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Inscription from './pages/Inscription';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import ClientDomainReservations from './pages/ClientDomainReservations';
import AdminDomainReservations from './pages/DomainReservations';
import Offers from './pages/Offers';
import './App.css';
import './index.css';
import WOW from 'wowjs';


// Component to handle WOW.js initialization on route change
const WowInitializer = () => {
  const location = useLocation();

  useEffect(() => {
    try {
      const wow = new WOW.WOW({
        live: false,
        mobile: false,
      });
      wow.init();
    } catch (error) {
      console.error('Failed to initialize WOW.js:', error);
    }
  }, [location.pathname]);

  return null;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!user) return <Navigate to="/login" />;
    if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <WowInitializer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Inscription />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/offers" element={<Offers />} />
        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientreser"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDomainReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/domain-reservations"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDomainReservations />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;