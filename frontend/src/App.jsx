import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<div className="p-6 text-2xl font-semibold">Products</div>} />
          <Route path="operations" element={<div className="p-6 text-2xl font-semibold">Operations</div>} />
          <Route path="settings" element={<div className="p-6 text-2xl font-semibold">Settings</div>} />
          <Route path="profile" element={<div className="p-6 text-2xl font-semibold">Profile</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
