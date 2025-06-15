import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const overviewData = {
  day: [
    { name: "Mon", total: 400 },
    { name: "Tue", total: 600 },
    { name: "Wed", total: 500 },
    { name: "Thu", total: 900 },
    { name: "Fri", total: 1200 },
    { name: "Sat", total: 300 },
    { name: "Sun", total: 1000 },
  ],
  week: [
    { name: "W1", total: 3200 },
    { name: "W2", total: 4500 },
    { name: "W3", total: 5000 },
    { name: "W4", total: 4000 },
  ],
  month: [
    { name: "Jan", total: 4500 },
    { name: "Feb", total: 1200 },
    { name: "Mar", total: 1250 },
    { name: "Apr", total: 3000 },
    { name: "May", total: 3700 },
    { name: "Jun", total: 1500 },
    { name: "Jul", total: 2800 },
    { name: "Aug", total: 3300 },
    { name: "Sep", total: 900 },
    { name: "Oct", total: 1100 },
    { name: "Nov", total: 2200 },
    { name: "Dec", total: 4000 },
  ],
};

const recentSales = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: 1999 },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: 39 },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: 299 },
  { name: "William Kim", email: "will@email.com", amount: 99 },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: 39 },
];

const pieData = [
  { name: "Electronics", value: 2400 },
  { name: "Clothing", value: 1600 },
  { name: "Books", value: 800 },
  { name: "Other", value: 1200 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function RevenueDashboard() {
  const [view, setView] = useState("month");

  return (
    <div
      style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <div style={cardStyle}>
          <p style={subTitleStyle}>Total Revenue</p>
          <p style={titleStyle}>$45,231.89</p>
          <p style={changeStyle}>+20.1% from last month</p>
        </div>
        <div style={cardStyle}>
          <p style={subTitleStyle}>Subscriptions</p>
          <p style={titleStyle}>+2350</p>
          <p style={changeStyle}>+180.1% from last month</p>
        </div>
        <div style={cardStyle}>
          <p style={subTitleStyle}>Sales</p>
          <p style={titleStyle}>+12,234</p>
          <p style={changeStyle}>+19% from last month</p>
        </div>
        <div style={cardStyle}>
          <p style={subTitleStyle}>Active Now</p>
          <p style={titleStyle}>+573</p>
          <p style={changeStyle}>+201 since last hour</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ ...cardStyle, height: 400 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Overview</h2>
            <div>
              {["day", "week", "month"].map((option) => (
                <button
                  key={option}
                  onClick={() => setView(option)}
                  style={{
                    marginLeft: 8,
                    padding: "4px 12px",
                    border: "1px solid #ccc",
                    backgroundColor: view === option ? "#333" : "#fff",
                    color: view === option ? "#fff" : "#333",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height="70%">
            <BarChart data={overviewData[view]}>
              <XAxis
                dataKey="name"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip formatter={(value) => `$${value}`} />
              <Bar dataKey="total" fill="#000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            Recent Sales
          </h2>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
            You made 265 sales this month.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentSales.map((sale, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={avatarStyle}>{sale.name.charAt(0)}</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{sale.name}</p>
                    <p style={{ fontSize: 12, color: "#999" }}>{sale.email}</p>
                  </div>
                </div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>
                  +${sale.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...cardStyle, height: 300 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            Revenue Trends
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={overviewData.month}>
              <XAxis
                dataKey="name"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...cardStyle, height: 300 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: 16,
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

const titleStyle = {
  fontSize: 24,
  fontWeight: 700,
  marginTop: 4,
};

const subTitleStyle = {
  fontSize: 14,
  color: "#777",
  marginBottom: 4,
};

const changeStyle = {
  fontSize: 12,
  color: "green",
  marginTop: 4,
};

const avatarStyle = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: "#ccc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  fontWeight: 600,
  color: "#fff",
  textTransform: "uppercase",
};
