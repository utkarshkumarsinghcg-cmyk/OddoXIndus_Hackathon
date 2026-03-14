import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Package, Truck, ArrowLeftRight, Activity, LayoutDashboard, Menu, X, User } from 'lucide-react';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Products', path: '/products', icon: Package },
        { name: 'Receipts', path: '/operations/receipts', icon: LayoutDashboard },
        { name: 'Delivery Orders', path: '/operations/delivery-orders', icon: Truck },
        { name: 'Transfers', path: '/operations/transfers', icon: ArrowLeftRight },
        { name: 'Adjustments', path: '/operations/adjustments', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Navbar overlay */}
            <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100 flex' : 'opacity-0 hidden'}`} onClick={() => setSidebarOpen(false)}></div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
                        <span className="text-xl font-bold text-indigo-600">WareNova</span>
                        <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(false)}>
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="space-y-1 px-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* Top Navbar */}
                <header className="flex-shrink-0 flex h-16 bg-white border-b border-gray-200 px-4 justify-between items-center shadow-sm">
                    <div className="flex items-center">
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <span className="ml-4 md:ml-0 text-xl font-bold text-indigo-600 md:hidden">WareNova</span>
                    </div>

                    {/* User Profile Icon */}
                    <div className="ml-4 flex items-center md:ml-6">
                        <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                            <span className="sr-only">View profile</span>
                            <User className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
                    <div className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
