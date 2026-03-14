import React from 'react';

const colors = {
    Done: 'bg-green-100 text-green-800',
    Waiting: 'bg-yellow-100 text-yellow-800',
    Draft: 'bg-gray-100 text-gray-800',
    Cancelled: 'bg-red-100 text-red-800',
};

export default function Badge({ status }) {
    const colorClass = colors[status] || colors.Draft;
    return (
        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
            {status}
        </span>
    );
}
