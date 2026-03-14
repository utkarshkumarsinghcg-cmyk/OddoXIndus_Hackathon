import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package2, Mail, Lock, Eye, EyeOff, User, Building } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex text-gray-900 font-sans">
      {/* Left Pane - Dark */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0f2942] flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <img src="/logo.svg" alt="Warenova" className="h-10 brightness-[200] contrast-[1.5]" />
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
            <div className="bg-[#163654] p-5 rounded-xl border border-gray-700/50">
              <div className="text-[28px] font-bold text-cyan-400 mb-2">250+</div>
              <div className="text-[10px] font-bold tracking-widest text-cyan-100 uppercase leading-snug">Vehicles<br/>Managed</div>
            </div>
            <div className="bg-[#163654] p-5 rounded-xl border border-gray-700/50">
              <div className="text-[28px] font-bold text-cyan-400 mb-2">98%</div>
              <div className="text-[10px] font-bold tracking-widest text-cyan-100 uppercase leading-snug">On-Time Delivery</div>
            </div>
            <div className="bg-[#163654] p-5 rounded-xl border border-gray-700/50">
              <div className="text-[28px] font-bold text-cyan-400 mb-2">$2.4M</div>
              <div className="text-[10px] font-bold tracking-widest text-cyan-100 uppercase leading-snug">Cost Savings</div>
            </div>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white overflow-y-auto max-h-screen">
        <div className="w-full max-w-md my-auto pb-8">
          <h2 className="text-4xl font-extrabold text-[#111827] mb-3 tracking-tight">Create account</h2>
          <p className="text-gray-500 font-medium text-base mb-8">Sign up to get started as a Fleet Manager</p>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-gray-800 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-[18px] w-[18px] text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="w-full pl-10 pr-4 py-2.5 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-gray-800 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-[18px] w-[18px] text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-bold text-gray-800 mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Building className="h-[18px] w-[18px] text-gray-400" />
                </div>
                <input
                  id="company"
                  type="text"
                  placeholder="Acme Corp"
                  className="w-full pl-10 pr-4 py-2.5 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
                  required
                />
              </div>
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
              <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">
                Password
              </label>
              <div className="relative rounded overflow-hidden border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white">
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
              className="w-full bg-[#0f2942] hover:bg-[#0a192f] text-white font-bold py-3.5 rounded transition-all mt-4"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#00E5FF] hover:text-cyan-500 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
