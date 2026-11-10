import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  accentColor: 'blue' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
  accentColor
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      iconText: 'text-blue-600',
      border: 'hover:border-blue-300'
    },
    indigo: {
      bg: 'bg-indigo-50',
      iconText: 'text-indigo-600',
      border: 'hover:border-indigo-300'
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconText: 'text-emerald-600',
      border: 'hover:border-emerald-300'
    },
    amber: {
      bg: 'bg-amber-50',
      iconText: 'text-amber-600',
      border: 'hover:border-amber-300'
    },
    purple: {
      bg: 'bg-purple-50',
      iconText: 'text-purple-600',
      border: 'hover:border-purple-300'
    },
    rose: {
      bg: 'bg-rose-50',
      iconText: 'text-rose-600',
      border: 'hover:border-rose-300'
    }
  };

  const style = colorMap[accentColor];

  return (
    <div className={`bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all ${style.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">{title}</span>
        <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.iconText} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trendPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
    </div>
  );
};
