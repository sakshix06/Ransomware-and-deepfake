import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";

interface AnimatedChartsProps {
  data: number[];
  riskScore: number;
  labels: string[];
}

export const AnimatedCharts = ({ data, riskScore, labels }: AnimatedChartsProps) => {
  const chartData = data.map((value, idx) => ({
    name: labels[idx] || `Point ${idx}`,
    value: Math.min(value * 10 + riskScore * 0.5, 100),
  }));

  const isHighRisk = riskScore > 60;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-[300px] mt-6"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc" }}
            itemStyle={{ color: isHighRisk ? "#ef4444" : "#9b87f5" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000}>
            {chartData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={isHighRisk ? "url(#colorDanger)" : "url(#colorSafe)"} 
                className="transition-all duration-500 hover:opacity-80"
              />
            ))}
          </Bar>
          <defs>
            <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9b87f5" stopOpacity={1}/>
              <stop offset="95%" stopColor="#312e81" stopOpacity={0.8}/>
            </linearGradient>
            <linearGradient id="colorDanger" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={1}/>
              <stop offset="95%" stopColor="#7f1d1d" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
