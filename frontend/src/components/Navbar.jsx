import { Bell, Search, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10 shadow-sm">
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
        <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        </button>
        <div className="pl-3 border-l border-gray-200">
          <img
            className="h-8 w-8 rounded-full border border-gray-200 object-cover cursor-pointer hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 transition-all"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
