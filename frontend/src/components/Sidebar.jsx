import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowLeftRight, Settings, User, LogOut, Package2 } from 'lucide-react';

const Sidebar = () => {
  const routes = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Operations', path: '/operations', icon: ArrowLeftRight },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col relative z-20 shadow-sm">
      <div className="h-16 flex items-center px-4 border-b border-gray-100 mt-2">
        <img src="/logo.svg" alt="Warenova" className="h-[48px] w-auto -ml-2" />
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1.5 px-3">
          {routes.map((route) => (
            <NavLink
              key={route.name}
              to={route.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <route.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${
                window.location.pathname.includes(route.path) ? 'text-cyan-600' : 'text-gray-400'
              }`} />
              {route.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-100">
        <NavLink
          to="/login"
          className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0 text-gray-400 group-hover:text-red-500" />
          Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
