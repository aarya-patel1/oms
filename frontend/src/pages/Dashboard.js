import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";

const cardStyle = {
  background: "#fff",
  borderRadius: "1rem",
  padding: "1.5rem",
  margin: "1rem",
  textAlign: "center",
  boxShadow: "0 2px 14px rgba(137,87,255,0.08)",
  fontWeight: "bold"
};

const panelStyle = {
  background: "#f3e5f5",
  borderRadius: "1rem",
  padding: "2rem",
  marginLeft: "2rem",
  minWidth: "240px"
};

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, shipments: 0, revenue: 0, lowStock: 0 });
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    function fetchStats() {
      Promise.all([
        axios.get(`${API_BASE}/products`),
        axios.get(`${API_BASE}/orders`)
      ]).then(([prodRes, orderRes]) => {
        const products = prodRes.data;
        const orders = orderRes.data;
        setStats({
          products: products.length,
          orders: orders.length,
          shipments: orders.filter(o => o.status === "Shipped").length,
          revenue: orders.reduce((tot, o) => tot + (o.totalprice || 0), 0) / 100,
          lowStock: products.filter(p => p.stock < 3).length
        });
        setActivity([
          ...orders.slice(-6).reverse().map(o => ({
            text: `Order ${o.id} ${o.status}`,
            type: o.status === "Shipped" ? "success" : "default"
          })),
          ...products.filter(p => p.stock < 3).map(p => ({
            text: `Low stock: ${p.name}`,
            type: "warning"
          }))
        ]);
      });
    }
    fetchStats();
    const interval = setInterval(fetchStats, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", padding: "2rem", background: "#f6f0fa", minHeight: "80vh" }}>
      <div style={{ flex: 2 }}>
        <h2 style={{ color: "#6a52b3" }}>Dashboard Overview</h2>
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
          <Card stat={stats.products} label="Total Products" />
          <Card stat={stats.orders} label="Total Orders" />
          <Card stat={stats.shipments} label="Shipments" />
          <Card stat={stats.lowStock} label="Low Stock" />
        </div>
        <ActivityFeed activity={activity} />
      </div>
      <div style={panelStyle}>
        <h3 style={{ color: "#6a52b3" }}>Notifications</h3>
        {activity.length === 0 ? <div>No notifications</div> : activity.map((n, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <span style={{
              color: n.type === "success" ? "#37be6b" : n.type === "warning" ? "#ffc107" : "#7c43bd"
            }}>●</span> {n.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ stat, label }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: "2rem" }}>{stat}</div>
      <div>{label}</div>
    </div>
  );
}

function ActivityFeed({ activity }) {
  return (
    <div>
      <h3>Activity Feed</h3>
      <div style={{
        background: "#e9dbf4",
        borderRadius: "0.7rem",
        padding: "1rem",
        marginTop: "1rem"
      }}>
        {activity.length === 0 ? <div>No recent activity</div> :
          activity.map((n, i) => (
            <div key={i} style={{
              marginBottom: "0.9rem",
              fontSize: "1.05rem",
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{
                marginRight: 8,
                color: n.type === "success" ? "#37be6b" : n.type === "warning" ? "#ffc107" : "#7c43bd"
              }}>●</span>
              {n.text}
            </div>
          ))
        }
      </div>
    </div>
  );
}
