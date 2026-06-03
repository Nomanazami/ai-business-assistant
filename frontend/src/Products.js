import { useState, useEffect } from "react";
import axios from "axios";

function Products({ onProductClick }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // ⭐ Products load karo
  useEffect(() => {
    axios.get("https://ai-business-assistant-backend-opal.vercel.app/api/products")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      });
  }, []);

  // ⭐ Filter karo category se
  const filtered = filter === "all"
    ? products
    : products.filter(p => p.category === filter);

  const categories = ["all", "oriental", "floral", "musk", "attar", "aquatic", "sweet"];

  if (loading) return (
    <div style={styles.loading}>⏳ Loading products...</div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛍️ Our Products</h2>

      {/* ⭐ Filter buttons */}
      <div style={styles.filters}>
        {categories.map(cat => (
          <button
            key={cat}
            style={{
              ...styles.filterBtn,
              background: filter === cat ? "#667eea" : "#f0f0f0",
              color: filter === cat ? "white" : "#333"
            }}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ⭐ Products grid */}
      <div style={styles.grid}>
        {filtered.map(product => (
          <div
            key={product._id}
            style={styles.card}
            onClick={() => onProductClick(product)}
          >
            <div style={styles.emoji}>{product.image}</div>
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.productDesc}>{product.description}</p>
            <div style={styles.cardFooter}>
              <span style={styles.price}>Rs. {product.price}</span>
              <span style={styles.rating}>⭐ {product.rating}</span>
            </div>
            <button style={styles.askBtn}>
              🤖 Ask AI
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
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
  filters: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "20px",
    justifyContent: "center"
  },
  filterBtn: {
    padding: "6px 14px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "15px"
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "transform 0.2s",
    textAlign: "center"
  },
  emoji: { fontSize: "40px", marginBottom: "8px" },
  productName: { margin: "0 0 5px", color: "#333", fontSize: "16px" },
  productDesc: { color: "#666", fontSize: "12px", margin: "0 0 10px" },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },
  price: { color: "#667eea", fontWeight: "bold", fontSize: "14px" },
  rating: { color: "#f59e0b", fontSize: "14px" },
  askBtn: {
    width: "100%",
    padding: "8px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px"
  }
};

export default Products;