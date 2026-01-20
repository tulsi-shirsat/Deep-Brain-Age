interface InfoCardProps {
  title: string;
  value: string | number;
  unit: string;
  color: 'blue' | 'pink' | 'green';
}

export function InfoCard({ title, value, unit, color }: InfoCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    pink: 'from-pink-50 to-pink-100 border-pink-200',
    green: 'from-green-50 to-green-100 border-green-200'
  };

  const textColorClasses = {
    blue: 'text-blue-600',
    pink: 'text-pink-600',
    green: 'text-green-600'
  };

  const valueColorClasses = {
    blue: 'text-blue-900',
    pink: 'text-pink-900',
    green: 'text-green-900'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 shadow-sm`}>
      <h3 className={`text-sm font-medium ${textColorClasses[color]} mb-3`}>
        {title}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-bold ${valueColorClasses[color]}`}>
          {value}
        </span>
        <span className={`text-lg ${textColorClasses[color]}`}>
          {unit}
        </span>
      </div>
    </div>
  );
}
