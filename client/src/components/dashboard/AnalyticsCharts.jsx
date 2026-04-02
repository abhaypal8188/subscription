import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { categoryColors, formatCurrency } from "../../utils/formatters.js";

function AnalyticsCharts({ categoryBreakdown = [], trends = [] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-panel p-6">
        <div className="mb-6">
          <p className="text-lg font-semibold">Category breakdown</p>
          <p className="text-sm text-slate-500 dark:text-slate-300">See where your money goes every month.</p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                {categoryBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={categoryColors[entry.name] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="mb-6">
          <p className="text-lg font-semibold">Monthly trend</p>
          <p className="text-sm text-slate-500 dark:text-slate-300">Track how recurring spend evolves over time.</p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="amount" stroke="#ff7a59" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCharts;

