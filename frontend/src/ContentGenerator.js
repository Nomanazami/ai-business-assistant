import { useState } from "react";
import axios from "axios";

function ContentGenerator({ token }) {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    platform: "instagram",
    tone: "casual"
  });

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  // ⭐ Content generate karo
  const generateContent = async () => {
    if (!formData.productName) return;
    setLoading(true);
    setContent(null);

    try {
      const response = await axios.post(
        "https://ai-business-assistant-backend-opal.vercel.app/api/content/generate",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setContent(response.data);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  // ⭐ Copy to clipboard
  const copyText = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        ✍️ AI Content Generator
      </h2>
      <p style={styles.subtitle}>
      Name the product - AI will create content! 
      </p>

      {/* ⭐ Form */}
      <div style={styles.form}>

        {/* Product Name */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            🏷️ Product Name 
          </label>
          <input
            style={styles.input}
            placeholder="like: Arabian Oud Perfume"
            value={formData.productName}
            onChange={(e) => setFormData({
              ...formData,
              productName: e.target.value
            })}
          />
        </div>

        {/* Description */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            📝 Product Description
          </label>
          <textarea
            style={styles.textarea}
            placeholder="like: This is a luxury Arabian fragrance that lasts for 12 hours."
            value={formData.description}
            onChange={(e) => setFormData({
              ...formData,
              description: e.target.value
            })}
          />
        </div>

        {/* Platform */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            📱 Select Platform 
          </label>
          <div style={styles.optionGrid}>
            {[
              { value: "instagram", label: "📸 Instagram" },
              { value: "facebook", label: "👍 Facebook" },
              { value: "whatsapp", label: "💬 WhatsApp" },
              { value: "tiktok", label: "🎵 TikTok" }
            ].map(p => (
              <button
                key={p.value}
                style={{
                  ...styles.optionBtn,
                  background: formData.platform === p.value
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : "#f0f0f0",
                  color: formData.platform === p.value
                    ? "white" : "#333"
                }}
                onClick={() => setFormData({
                  ...formData, platform: p.value
                })}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            🎭 Select Tone
          </label>
          <div style={styles.optionGrid}>
            {[
              { value: "casual", label: "😊 Casual" },
              { value: "professional", label: "💼 Professional" },
              { value: "funny", label: "😄 Funny" },
              { value: "luxury", label: "👑 Luxury" }
            ].map(t => (
              <button
                key={t.value}
                style={{
                  ...styles.optionBtn,
                  background: formData.tone === t.value
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : "#f0f0f0",
                  color: formData.tone === t.value
                    ? "white" : "#333"
                }}
                onClick={() => setFormData({
                  ...formData, tone: t.value
                })}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          style={styles.generateBtn}
          onClick={generateContent}
          disabled={loading}
        >
          {loading ? "⏳ Generating..." : "✨ Generate Content"}
        </button>
      </div>

      {/* ⭐ Generated Content */}
      {content && (
        <div style={styles.results}>
          <h3 style={styles.resultsTitle}>
            🎉 Your Content is Ready
          </h3>

          {/* Caption */}
          <ContentCard
            title="📸 Caption"
            text={content.caption}
            onCopy={() => copyText(content.caption, "caption")}
            copied={copied === "caption"}
          />

          {/* Ad Copy */}
          <ContentCard
            title="📢 Ad Copy"
            text={content.adCopy}
            onCopy={() => copyText(content.adCopy, "adCopy")}
            copied={copied === "adCopy"}
          />

          {/* WhatsApp */}
          <ContentCard
            title="💬 WhatsApp Message"
            text={content.whatsappMessage}
            onCopy={() => copyText(
              content.whatsappMessage, "whatsapp"
            )}
            copied={copied === "whatsapp"}
          />

          {/* Hashtags */}
          <ContentCard
            title="# Hashtags"
            text={content.hashtags}
            onCopy={() => copyText(
              content.hashtags, "hashtags"
            )}
            copied={copied === "hashtags"}
          />

          {/* CTA */}
          <ContentCard
            title="🎯 Call To Action"
            text={content.callToAction}
            onCopy={() => copyText(
              content.callToAction, "cta"
            )}
            copied={copied === "cta"}
          />
        </div>
      )}
    </div>
  );
}

// ⭐ Content Card Component
function ContentCard({ title, text, onCopy, copied }) {
  return (
    <div style={cardStyles.card}>
      <div style={cardStyles.header}>
        <span style={cardStyles.title}>{title}</span>
        <button
          style={{
            ...cardStyles.copyBtn,
            background: copied ? "#22c55e" : "#667eea"
          }}
          onClick={onCopy}
        >
          {copied ? "✅ Copied!" : "📋 Copy"}
        </button>
      </div>
      <p style={cardStyles.text}>{text}</p>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxHeight: "500px",
    overflowY: "auto"
  },
  title: {
    textAlign: "center",
    color: "#333",
    margin: "0 0 5px"
  },
  subtitle: {
    textAlign: "center",
    color: "#888",
    fontSize: "13px",
    marginBottom: "20px"
  },
  form: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
  },
  inputGroup: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#444",
    marginBottom: "6px"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    height: "80px",
    resize: "none"
  },
  optionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px"
  },
  optionBtn: {
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "bold"
  },
  generateBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px"
  },
  results: {
    marginTop: "20px"
  },
  resultsTitle: {
    textAlign: "center",
    color: "#333",
    marginBottom: "15px"
  }
};

const cardStyles = {
  card: {
    background: "white",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  title: {
    fontWeight: "bold",
    color: "#444",
    fontSize: "14px"
  },
  copyBtn: {
    color: "white",
    border: "none",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px"
  },
  text: {
    color: "#555",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: 0
  }
};

export default ContentGenerator;