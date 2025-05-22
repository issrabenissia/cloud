// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { FaUsers, FaDollarSign, FaChartLine, FaSignOutAlt, FaGlobe, FaBox, FaTachometerAlt, FaFileAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Clients from './Client';
import '../Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const [showClients, setShowClients] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [hostedSites, setHostedSites] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const navigate = useNavigate();

  // Function to fetch all stats, including client count
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token manquant, redirection vers /login');
        navigate('/login');
        return;
      }

      // Fetch reservations
      const reservationsResponse = await axios.get('http://localhost:5000/api/reservations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Réservations récupérées:', reservationsResponse.data);
      setReservationCount(reservationsResponse.data.length);

      // Fetch offers
      const offersResponse = await axios.get('http://localhost:5000/api/offers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Offres récupérées:', offersResponse.data);
      setOfferCount(offersResponse.data.length);

      // Calculate hosted sites
      const hostedCount = reservationsResponse.data.filter(
        (res) => res.payment_status === 'paid' && res.hosting_needed
      ).length;
      console.log('Nombre de sites hébergés:', hostedCount);
      setHostedSites(hostedCount);

      // Fetch clients
      const clientsResponse = await axios.get('http://localhost:5000/api/users?role=client', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Clients récupérés:', clientsResponse.data);
      setClientCount(clientsResponse.data.length);

      // Calculate total revenue from paid reservations
      const paidReservations = reservationsResponse.data.filter(
        (res) => res.payment_status === 'paid'
      );
      console.log('Réservations payées:', paidReservations);

      let totalRevenue = 0;
      for (const reservation of paidReservations) {
        const offer = offersResponse.data.find((o) => o.id === reservation.offer_id);
        if (offer) {
          totalRevenue += offer.price || 0;
        }
      }
      console.log('Revenus mensuels calculés:', totalRevenue);
      setMonthlyRevenue(totalRevenue);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchStats();
  }, [navigate]);

  // Refetch stats when showClients changes
  useEffect(() => {
    if (!showClients) {
      // When closing the Clients section, refetch stats to update client count
      fetchStats();
    }
  }, [showClients]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>HostAdmin</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <FaTachometerAlt className="icon" /> Dashboard
            </li>
            <li onClick={() => setShowClients(!showClients)}>
              <FaUsers className="icon" /> Clients
            </li>
            <li>
              <Link to="/domain-reservations">
                <FaFileAlt className="icon" /> Réservations
              </Link>
            </li>
            <li>
              <Link to="/offers">
                <FaBox className="icon" /> Offres
              </Link>
            </li>
            <li>
              <Link to="/stats">
                <FaChartLine className="icon" /> Statistiques
              </Link>
            </li>
            <li className="logout" onClick={handleLogout}>
              <FaSignOutAlt className="icon" /> Déconnexion
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h1>Bienvenue, Admin</h1>
          <div className="user-profile">
            <img src="https://via.placeholder.com/40" alt="Profil" onError={(e) => (e.target.style.display = 'none')} />
          </div>
        </header>

        <div className="stats-grid">
          <Link to="/stats/clients" className="stat-link">
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div>
                <h3>{clientCount}</h3>
                <p>Clients</p>
              </div>
            </div>
          </Link>
          <Link to="/stats/revenue" className="stat-link">
            <div className="stat-card">
              <FaDollarSign className="stat-icon" />
              <div>
                <h3>{monthlyRevenue.toLocaleString('fr-FR')}€</h3>
                <p>Revenus</p>
              </div>
            </div>
          </Link>
          <Link to="/stats/hosted-sites" className="stat-link">
            <div className="stat-card">
              <FaGlobe className="stat-icon" />
              <div>
                <h3>{hostedSites}</h3>
                <p>Sites Hébergés</p>
              </div>
            </div>
          </Link>
          <Link to="/stats/offers" className="stat-link">
            <div className="stat-card">
              <FaBox className="stat-icon" />
              <div>
                <h3>{offerCount}</h3>
                <p>Offres</p>
              </div>
            </div>
          </Link>
          <Link to="/stats/reservations" className="stat-link">
            <div className="stat-card">
              <FaFileAlt className="stat-icon" />
              <div>
                <h3>{reservationCount}</h3>
                <p>Réservations</p>
              </div>
            </div>
          </Link>
        </div>

        {showClients && <Clients setClientCount={setClientCount} fetchStats={fetchStats} />}

        <div className="recent-activity">
          <h2>Activité Récente</h2>
          <div className="activity-list">
            <div className="activity-item">
              <p>Nouveau client ajouté: client123.com</p>
              <span>il y a 2 heures</span>
            </div>
            <div className="activity-item">
              <p>Réservation acceptée pour client456.com</p>
              <span>il y a 4 heures</span>
            </div>
          </div>
        </div>
      </main>

      <style>
        {`
          .dashboard-container {
            display: flex;
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .sidebar {
            width: 250px;
            background: #2c3e50;
            color: #fff;
            padding: 20px 0;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          }

          .sidebar-header {
            padding: 10px 20px;
            border-bottom: 1px solid #34495e;
            text-align: center;
          }

          .sidebar-nav ul {
            list-style: none;
            padding: 0;
          }

          .sidebar-nav ul li {
            padding: 15px 20px;
            cursor: pointer;
            transition: background 0.3s;
            display: flex;
            align-items: center;
          }

          .sidebar-nav ul li:hover,
          .sidebar-nav ul li.active {
            background: #34495e;
          }

          .sidebar-nav ul li .icon {
            margin-right: 10px;
            font-size: 1.2rem;
          }

          .sidebar-nav ul li a {
            color: #fff;
            text-decoration: none;
            display: flex;
            align-items: center;
            width: 100%;
          }

          .sidebar-nav ul li.logout {
            margin-top: auto;
          }

          .main-content {
            flex: 1;
            padding: 40px;
            background: #f4f6f9;
            overflow-y: auto;
          }

          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }

          .dashboard-header h1 {
            font-size: 2.5rem;
            color: #2c3e50;
          }

          .user-profile img {
            border-radius: 50%;
            width: 40px;
            height: 40px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .stat-card {
            background: #fff;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.2s;
          }

          .stat-link {
            text-decoration: none;
            color: inherit;
          }

          .stat-card:hover {
            transform: translateY(-5px);
          }

          .stat-icon {
            font-size: 2rem;
            color: #3498db;
            margin-bottom: 10px;
          }

          .stat-card h3 {
            font-size: 1.8rem;
            color: #2c3e50;
            margin: 0;
          }

          .stat-card p {
            color: #555;
            margin: 5px 0 0;
          }

          .recent-activity {
            background: #fff;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }

          .recent-activity h2 {
            font-size: 1.5rem;
            color: #2c3e50;
            margin-bottom: 20px;
          }

          .activity-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
          }

          .activity-item p {
            margin: 0;
            color: #555;
          }

          .activity-item span {
            color: #888;
            font-size: 0.9rem;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;