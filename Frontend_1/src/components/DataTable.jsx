import React from 'react';

export default function DataTable({ columns, data, onEdit, onDelete }) {
    return (
        <div className="flex flex-col">
            <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    scope="col"
                                    className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th scope="col" className="relative px-4 md:px-6 py-3 whitespace-nowrap">
                                    <span className="sr-only">Actions</span>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(row)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 md:px-6 py-4 text-center text-sm text-gray-500 whitespace-nowrap">
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
