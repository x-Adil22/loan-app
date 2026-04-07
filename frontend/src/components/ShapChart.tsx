import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface ShapProps {
  shapData: Array<{ feature: string, value: number, contribution: number }>;
}

export default function ShapChart({ shapData }: ShapProps) {
  // Sort by absolute contribution to show most important features first
  const sortedData = [...shapData].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="feature" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            width={120}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const isPositive = data.contribution > 0;
                return (
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-4 shadow-xl rounded-xl border border-slate-100 dark:border-slate-700 text-sm">
                    <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">{data.feature}</p>
                    <p className="text-slate-500 dark:text-slate-400">Input Value: <span className="font-semibold text-slate-700 dark:text-slate-300">{data.value}</span></p>
                    <p className={isPositive ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>
                      Impact: {isPositive ? '+' : ''}{data.contribution.toFixed(3)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine x={0} stroke="#cbd5e1" strokeDasharray="3 3"/>
          <Bar dataKey="contribution" radius={[0, 4, 4, 0]} maxBarSize={30}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.contribution > 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
