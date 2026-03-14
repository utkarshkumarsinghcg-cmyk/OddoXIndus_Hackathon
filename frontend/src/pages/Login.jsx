import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('Invalid email, password, or role');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex text-gray-900 font-sans">
      {/* Left Pane - Dark */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#121826] flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10 text-blue-500">
          <div className="bg-blue-500 p-1.5 rounded text-white inline-flex">
            <Package2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Shipzo</span>
        </div>

        {/* Hero Content */}
        <div className="max-w-md mt-16 z-10">
          <h1 className="text-[44px] font-extrabold leading-[1.1] mb-6 tracking-tight">
            Manage your fleet<br />with confidence.
          </h1>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium">
            Replace manual logbooks with a centralized, rule-based digital platform. 
            Optimize vehicle lifecycle, monitor driver safety, and track financial performance.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#1C2434] p-5 rounded-xl border border-gray-800/50">
              <div className="text-[28px] font-bold text-emerald-400 mb-2">250+</div>
              <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase leading-snug">Vehicles<br/>Managed</div>
            </div>
            <div className="bg-[#1C2434] p-5 rounded-xl border border-gray-800/50">
              <div className="text-[28px] font-bold text-emerald-400 mb-2">98%</div>
              <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase leading-snug">On-Time Delivery</div>
            </div>
            <div className="bg-[#1C2434] p-5 rounded-xl border border-gray-800/50">
              <div className="text-[28px] font-bold text-emerald-400 mb-2">$2.4M</div>
              <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase leading-snug">Cost Savings</div>
            </div>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-extrabold text-[#111827] mb-3 tracking-tight">Welcome back</h2>
          <p className="text-gray-500 font-medium text-base mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded border border-red-200 bg-red-50 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-bold text-gray-800 mb-2">
                Role
              </label>
              <select
                id="role"
                className="w-full px-4 py-2.5 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700 bg-white"
              >
                <option>Fleet Manager</option>
                <option>Driver</option>
                <option>Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-[18px] w-[18px] text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-gray-800">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-bold text-emerald-400 hover:text-emerald-500 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative rounded overflow-hidden border border-blue-400 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all bg-white shadow-[0_0_0_2px_rgba(59,130,246,0.1)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px] text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 outline-none text-gray-700 bg-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1C2434] hover:bg-[#111827] text-white font-bold py-3.5 rounded transition-all mt-4"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-emerald-400 hover:text-emerald-500 transition-colors">
              Contact Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
