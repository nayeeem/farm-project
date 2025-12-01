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

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

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
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Reports />} />
            <Route path="/farmers" element={<FarmerList />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/lands" element={<LandManager />} />
            <Route path="/crops" element={<CropPlanning />} />
            <Route path="/inventory" element={<InventoryManager />} />
            <Route path="/assets" element={<AssetManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
