import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { InventoryProvider, useInventory } from './context/InventoryContext';

// Layout and Pages
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Receipts from './pages/Operations/Receipts';
import Deliveries from './pages/Operations/Deliveries';
import Adjustments from './pages/Operations/Adjustments';
import Transfers from './pages/Operations/Transfers';
import MoveHistory from './pages/Operations/History';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

// Close sidebar on route change (mobile)
const RouteWatcher = ({ onRouteChange }) => {
  const location = useLocation();
  useEffect(() => { onRouteChange(); }, [location.pathname]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const { user } = useInventory();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <RouteWatcher onRouteChange={() => setSidebarOpen(false)} />
      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <Topbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <div className="page-container animate-fade-in" key={window.location.pathname}>
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <InventoryProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/operations/receipts" element={<ProtectedRoute><Receipts /></ProtectedRoute>} />
          <Route path="/operations/deliveries" element={<ProtectedRoute><Deliveries /></ProtectedRoute>} />
          <Route path="/operations/adjustments" element={<ProtectedRoute><Adjustments /></ProtectedRoute>} />
          <Route path="/operations/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
          <Route path="/operations/history" element={<ProtectedRoute><MoveHistory /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </InventoryProvider>
  );
}

export default App;
