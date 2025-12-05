import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';

import FarmerList from './components/FarmerList';
import TaskList from './components/TaskList';
import InventoryManager from './components/InventoryManager';
import AssetManager from './components/AssetManager';
import Reports from './components/Reports';
import LandManager from './components/LandManager';
import CropPlanning from './components/CropPlanning';

// Placeholder components
// const Dashboard = () => <div className="animate-fade-in"><h2>Dashboard</h2><p>Welcome to the Farm Management System.</p></div>;
// const Farmers = () => <div className="animate-fade-in"><h2>Farmers</h2><p>Manage your farmers here.</p></div>;
// const Tasks = () => <div className="animate-fade-in"><h2>Tasks</h2><p>Track farming tasks.</p></div>;
// const Inventory = () => <div className="animate-fade-in"><h2>Inventory</h2><p>Buy and sell items.</p></div>;
// const Assets = () => <div className="animate-fade-in"><h2>Assets</h2><p>Manage farm assets.</p></div>;

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import { Navigate } from 'react-router-dom';

// ... (imports remain the same)

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  if (!user) return null;

  return (
    <nav className="navbar">
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        FarmManager
      </div>
      <div className="nav-links">
        <Link to="/" className={isActive('/')}>Dashboard</Link>
        <Link to="/farmers" className={isActive('/farmers')}>Farmers</Link>
        <Link to="/tasks" className={location.pathname === '/tasks' ? 'active' : ''}>Tasks</Link>
        <Link to="/lands" className={location.pathname === '/lands' ? 'active' : ''}>Lands</Link>
        <Link to="/crops" className={location.pathname === '/crops' ? 'active' : ''}>Crops</Link>
        <Link to="/inventory" className={location.pathname === '/inventory' ? 'active' : ''}>Inventory</Link>
        <Link to="/assets" className={isActive('/assets')}>Assets</Link>
        {user.role === 'admin' && <Link to="/users" className={isActive('/users')}>Users</Link>}
        <button onClick={logout} className="btn btn-secondary" style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Logout</button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/farmers" element={<ProtectedRoute><FarmerList /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
              <Route path="/lands" element={<ProtectedRoute><LandManager /></ProtectedRoute>} />
              <Route path="/crops" element={<ProtectedRoute><CropPlanning /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><InventoryManager /></ProtectedRoute>} />
              <Route path="/assets" element={<ProtectedRoute><AssetManager /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
