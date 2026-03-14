import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowLeftRight, ArrowRightLeft, Settings, User, LogOut, ChevronDown, ChevronRight, FilePlus, Boxes, LayoutList, RefreshCw, ArrowDownToLine, Truck, PenTool, History, Building2 } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({
    Products: true,
    Operations: true,
    Settings: false,
  });

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const menuConfig = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { 
      name: 'Products', 
      icon: Package,
      subItems: [
        { name: 'Create/Update', path: '/products/manage', icon: FilePlus },
        { name: 'Stock Availability', path: '/products/stock', icon: Boxes },
        { name: 'Categories', path: '/products/categories', icon: LayoutList },
        { name: 'Reordering Rules', path: '/products/reordering', icon: RefreshCw },
      ]
    },
    { 
      name: 'Operations', 
      icon: ArrowLeftRight,
      subItems: [
        { name: 'Receipts', path: '/operations/receipts', icon: ArrowDownToLine },
        { name: 'Delivery Orders', path: '/operations/deliveries', icon: Truck },
        { name: 'Internal Transfers', path: '/operations/transfers', icon: ArrowRightLeft },
        { name: 'Inventory Adjustment', path: '/operations/adjustments', icon: PenTool },
        { name: 'Move History', path: '/operations/history', icon: History },
      ]
    },
    { 
      name: 'Settings', 
      icon: Settings,
      subItems: [
        { name: 'Warehouse', path: '/settings/warehouses', icon: Building2 },
      ]
    },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-[280px] bg-white border-r border-gray-200 hidden md:flex flex-col relative z-20 shadow-sm">
      <div className="h-20 flex items-center px-4 border-b border-gray-100 mt-2">
        <img src="/logo.svg" alt="Warenova" className="h-[64px] w-auto -ml-3" />
      </div>
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        <nav className="space-y-1.5 px-3">
          {menuConfig.map((route) => (
            <div key={route.name}>
              {route.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(route.name)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <route.icon className={`w-5 h-5 mr-3 flex-shrink-0 text-gray-500`} />
                      {route.name}
                    </div>
                    {openMenus[route.name] ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </button>
                  {openMenus[route.name] && (
                    <div className="mt-1 ml-4 border-l-2 border-gray-100 pl-3 space-y-1">
                      {route.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActive
                                ? 'bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-100/50'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                        >
                          <subItem.icon className={`w-4 h-4 mr-3 flex-shrink-0 ${location.pathname.includes(subItem.path) ? 'text-cyan-600' : 'text-gray-400'}`} />
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
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
                    location.pathname.includes(route.path) ? 'text-cyan-600' : 'text-gray-400'
                  }`} />
                  {route.name}
                </NavLink>
              )}
            </div>
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
