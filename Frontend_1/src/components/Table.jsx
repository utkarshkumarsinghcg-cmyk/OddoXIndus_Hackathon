const Table = ({ title, data, columns }) => {
  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
      {title && (
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 uppercase tracking-wider text-xs font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-cyan-50/30 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 text-gray-700">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
