import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, User, Settings, LogOut, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const notifications = [
    { id: 1, title: 'Low Stock Alert', message: 'Product "A4 Paper" is running low.', time: '2 mins ago', icon: Package, color: 'text-amber-500 bg-amber-50' },
    { id: 2, title: 'New Delivery', message: 'Shipment #4592 has arrived at WH01.', time: '1 hour ago', icon: Bell, color: 'text-emerald-500 bg-emerald-50' },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-30 shadow-sm relative">
      <div className="flex items-center flex-1">
        <button className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:flex items-center w-full max-w-md ml-4 md:ml-0">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-cyan-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white sm:text-sm transition-all duration-200 font-medium text-gray-900"
              placeholder="Search products, orders..."
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center ml-4 space-x-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className={`relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors ${showNotifications ? 'bg-gray-100' : ''}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 animate-fade-in origin-top-right z-50">
              <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors border-b border-gray-50 last:border-0">
                    <div className={`p-2 rounded-xl h-10 w-10 flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                      <notif.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1 font-medium">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-50 text-center">
                <button className="text-sm font-medium text-cyan-600 hover:text-cyan-700">View All</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="pl-3 border-l border-gray-200 relative" ref={profileRef}>
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center outline-none focus:outline-none"
          >
            <img
              className={`h-8 w-8 rounded-full border border-gray-200 object-cover hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 transition-all ${showProfile ? 'ring-2 ring-cyan-500 ring-offset-2' : ''}`}
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 py-1.5 animate-fade-in origin-top-right z-50">
              <div className="px-4 py-3 border-b border-gray-50 mb-1">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs font-medium text-gray-500 truncate">john@warenova.com</p>
              </div>
              
              <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-600 transition-colors mx-1 rounded-lg">
                <User className="h-4 w-4 mr-3 text-gray-400" />
                My Profile
              </Link>
              <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-600 transition-colors mx-1 rounded-lg">
                <Settings className="h-4 w-4 mr-3 text-gray-400" />
                Account Settings
              </Link>
              
              <div className="border-t border-gray-50 my-1"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mx-1 rounded-lg"
              >
                <LogOut className="h-4 w-4 mr-3 text-red-400" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
