import React from 'react';

export default function Filters({ label, options, value, onChange }) {
    return (
        <div className="flex flex-col">
            {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
            <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border text-gray-700"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">All</option>
                {options.map((opt) => (
                    <option key={opt.value || opt} value={opt.value || opt}>
                        {opt.label || opt}
                    </option>
                ))}
            </select>
        </div>
    );
}
