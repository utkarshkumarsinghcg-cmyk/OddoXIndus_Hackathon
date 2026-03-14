const DashboardCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-3">
          <p className="text-xs font-bold text-gray-500 mb-1.5 leading-tight uppercase tracking-wide line-clamp-2">{title}</p>
          <h3 className="text-2xl font-black text-gray-900">{value}</h3>
        </div>
        <div className="p-3 bg-cyan-50 rounded-xl flex-shrink-0">
          <Icon className="w-5 h-5 text-cyan-600" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend === 'up' ? '+' : '-'}{trendValue}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
