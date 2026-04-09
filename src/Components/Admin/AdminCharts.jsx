import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#db4444", "#4a90e2", "#50c878", "#ffad33", "#9b59b6", "#1abc9c", "#e74c3c", "#3498db"];

/** Pie Chart: Revenue by Category */
export function SalesByCategoryPie({ data }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value: Number(value) || 0 }));
  if (chartData.length === 0) return <p className="chartNoData">No data available.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={115}
          label={({ name, value }) => `${name}: ${value}`}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Bar Chart: Sales by Category */
export function SalesByCategoryBar({ data }) {
  const chartData = Object.entries(data || {}).map(([name, sold]) => ({ name, sold: Number(sold) || 0 }));
  if (chartData.length === 0) return <p className="chartNoData">No data available.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="sold" name="Sold (units)">
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Line Chart: Daily Revenue
 * data: Array of { date: "2026-03-01", revenue: 1200 }
 */
export function RevenueByDayLine({ data }) {
  if (!data || data.length === 0)
    return <p className="chartNoData">No order data available.</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 24, left: 10, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          angle={-35}
          textAnchor="end"
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `$${v.toLocaleString()}`}
        />
        <Tooltip
          formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
        />
        <Legend wrapperStyle={{ paddingTop: "16px" }} />
        <Line
          type="natural"
          dataKey="revenue"
          name="Daily Revenue ($)"
          stroke="#4a90e2"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#4a90e2" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}


/**
 * Line Chart: Revenue by Category
 * data: Object { category: revenue, ... }
 */
export function RevenueByCategoryLine({ data }) {
  const chartData = Object.entries(data || {}).map(([name, revenue]) => ({
    name,
    revenue: Number(Number(revenue).toFixed(2)),
  }));

  if (chartData.length === 0)
    return <p className="chartNoData">No category revenue data available.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 10, right: 24, left: 10, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11 }}
          angle={-20}
          textAnchor="end"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `$${v.toLocaleString()}`}
        />
        <Tooltip
          formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
        />
        <Legend wrapperStyle={{ paddingTop: "16px" }} />
        <Line
          type="natural"
          dataKey="revenue"
          name="Category Revenue ($)"
          stroke="#db4444"
          strokeWidth={2.5}
          dot={({ cx, cy, index }) => (
            <circle key={index} cx={cx} cy={cy} r={5} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={1.5} />
          )}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
