import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ placeholder, value, onChange }) {
    return (
        <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                placeholder={placeholder || 'Search by name or SKU...'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
