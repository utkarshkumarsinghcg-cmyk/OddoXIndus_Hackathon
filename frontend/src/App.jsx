import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import ProductManagement from './pages/products/ProductManagement';
import Receipts from './pages/operations/Receipts';
import Deliveries from './pages/operations/Deliveries';
import Transfers from './pages/operations/Transfers';
import Adjustments from './pages/operations/Adjustments';
import Warehouses from './pages/settings/Warehouses';

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
          
          {/* Products Routes */}
          <Route path="products">
            <Route path="manage" element={<ProductManagement />} />
            <Route path="stock" element={<div className="p-6"><h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Stock Availability</h1><p className="text-gray-500 mt-1">Real-time mapping of stock quantities across your warehouses.</p></div>} />
            <Route path="categories" element={<div className="p-6"><h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Categories</h1><p className="text-gray-500 mt-1">Manage product taxonomies.</p></div>} />
            <Route path="reordering" element={<div className="p-6"><h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reordering Rules</h1><p className="text-gray-500 mt-1">Automate stock purchasing based on inventory thresholds.</p></div>} />
          </Route>

          {/* Operations Routes */}
          <Route path="operations">
            <Route path="receipts" element={<Receipts />} />
            <Route path="deliveries" element={<Deliveries />} />
            <Route path="transfers" element={<Transfers />} />
            <Route path="adjustments" element={<Adjustments />} />
            <Route path="history" element={<div className="p-6"><h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Move History</h1><p className="text-gray-500 mt-1">Global audit log of every stock movement.</p></div>} />
          </Route>

          {/* Settings Routes */}
          <Route path="settings">
             <Route path="warehouses" element={<Warehouses />} />
             <Route index element={<div className="p-6 text-2xl font-semibold">Settings Overview</div>} />
          </Route>

          <Route path="profile" element={<div className="p-6 text-2xl font-semibold">Profile Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
