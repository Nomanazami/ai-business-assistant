import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Stats load karo
  useEffect(() => {
    axios.get("https://ai-business-assistant-backend-opal.vercel.app/api/stats/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setStats(res.data.stats);
      setRecentUsers(res.data.recentUsers);
      setProducts(res.data.products);
      setLoading(false);
    })
    .catch(err => {
      console.error("Stats error:", err);
      setLoading(false);
    });
  }, [token]);

  if (loading) return (
    <div style={styles.loading}>
      ⏳ Loading dashboard...
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Business Dashboard</h2>

      {/* ⭐ Stats Cards */}
      <div style={styles.statsGrid}>
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="#667eea"
        />
        <StatCard
          icon="💬"
          label="Total Chats"
          value={stats?.totalChats || 0}
          color="#764ba2"
        />
        <StatCard
          icon="📦"
          label="Products"
          value={stats?.totalProducts || 0}
          color="#f59e0b"
        />
        <StatCard
          icon="✉️"
          label="Messages"
          value={stats?.totalMessages || 0}
          color="#22c55e"
        />
      </div>

      {/* ⭐ Recent Users */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          👥 Recent Users
        </h3>
        <div style={styles.table}>
          {/* Header */}
          <div style={styles.tableHeader}>
            <span>Name</span>
            <span>Email</span>
            <span>Date</span>
          </div>
          {/* Rows */}
          {recentUsers.map((user, i) => (
            <div key={i} style={styles.tableRow}>
              <span style={styles.userName}>
                👤 {user.name}
              </span>
              <span style={styles.userEmail}>
                {user.email}
              </span>
              <span style={styles.userDate}>
                {new Date(user.createdAt)
                  .toLocaleDateString('en-PK')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ Products Table */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          🛍️ Products Overview
        </h3>
        <div style={styles.table}>
          {/* Header */}
          <div style={styles.tableHeader}>
            <span>Product</span>
            <span>Price</span>
            <span>Rating</span>
          </div>
          {/* Rows */}
          {products.map((p, i) => (
            <div key={i} style={styles.tableRow}>
              <span style={styles.userName}>
                {p.name}
              </span>
              <span style={{ color: "#667eea", fontWeight: "bold" }}>
                Rs. {p.price}
              </span>
              <span style={{ color: "#f59e0b" }}>
                ⭐ {p.rating}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ⭐ Stat Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={{
        ...styles.statIcon,
        background: color
      }}>
        {icon}
      </div>
      <div>
        <p style={styles.statValue}>{value}</p>
        <p style={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxHeight: "500px",
    overflowY: "auto",
    background: "#f9f9f9"
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px"
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    color: "#666"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "20px"
  },
  statCard: {
    background: "white",
    borderRadius: "12px",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },
  statIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px"
  },
  statValue: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333"
  },
  statLabel: {
    margin: 0,
    fontSize: "12px",
    color: "#888"
  },
  section: {
    background: "white",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },
  sectionTitle: {
    color: "#333",
    marginBottom: "12px",
    fontSize: "16px"
  },
  table: {
    width: "100%"
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    padding: "8px 12px",
    background: "#f0f0f0",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#666",
    marginBottom: "8px"
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    padding: "10px 12px",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "13px",
    alignItems: "center"
  },
  userName: {
    color: "#333",
    fontWeight: "500"
  },
  userEmail: {
    color: "#666",
    fontSize: "12px"
  },
  userDate: {
    color: "#888",
    fontSize: "12px"
  }
};

export default Dashboard;