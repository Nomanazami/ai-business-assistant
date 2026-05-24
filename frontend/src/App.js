import { useState } from "react";
import axios from "axios";
import Products from "./Products";
import ContentGenerator from "./ContentGenerator";
import Dashboard from "./Dashboard";

function App() {
  // ⭐ Login state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ⭐ Auth form state
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({
    name: "", email: "", password: ""
  });
  const [authError, setAuthError] = useState("");

  // ⭐ Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("chat");

  // ⭐ Register/Login function
  const handleAuth = async () => {
    try {
      setAuthError("");
      const url = authMode === "login"
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const response = await axios.post(url, authData);

      setUser(response.data.user);
      setToken(response.data.token);

    } catch (err) {
      setAuthError(err.response?.data?.error || "Kuch galat hua!");
    }
  };

  // ⭐ Logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setMessages([]);
  };

  // ⭐ Send message
  const sendMessage = async (customMessage) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    const userMessage = { role: "user", content: messageToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setPage("chat");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        { messages: updatedMessages },
        {
          headers: {
            Authorization: `Bearer ${token}` // ⭐ Token bhejo
          }
        }
      );
      setMessages([...updatedMessages, {
        role: "assistant",
        content: response.data.reply
      }]);
    } catch (err) {
      setAuthError("Chat error!");
    }
    setLoading(false);
  };

  const handleProductClick = (product) => {
    sendMessage(
      `Mujhe ${product.name} ke baare mein batao. Rs.${product.price} mein value for money hai?`
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // ⭐ Agar login nahi — Login/Register form dikha
  if (!user) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>

          {/* Header */}
          <div style={styles.authHeader}>
            <h2 style={styles.authTitle}>🏪 Ahmed Perfume Shop</h2>
            <p style={styles.authSubtitle}>AI Business Assistant</p>
          </div>

          {/* Form */}
          <div style={styles.authForm}>
            <h3 style={styles.formTitle}>
              {authMode === "login" ? "Login Karo" : "Account Banao"}
            </h3>

            {/* Name — sirf register mein */}
            {authMode === "register" && (
              <input
                style={styles.authInput}
                placeholder="Tumhara naam"
                value={authData.name}
                onChange={(e) => setAuthData({
                  ...authData, name: e.target.value
                })}
              />
            )}

            <input
              style={styles.authInput}
              placeholder="Email"
              type="email"
              value={authData.email}
              onChange={(e) => setAuthData({
                ...authData, email: e.target.value
              })}
            />

            <input
              style={styles.authInput}
              placeholder="Password"
              type="password"
              value={authData.password}
              onChange={(e) => setAuthData({
                ...authData, password: e.target.value
              })}
            />

            {/* Error */}
            {authError && (
              <p style={styles.errorText}>❌ {authError}</p>
            )}

            {/* Button */}
            <button
              style={styles.authButton}
              onClick={handleAuth}
            >
              {authMode === "login" ? "Login 🚀" : "Register ✅"}
            </button>

            {/* Switch */}
            <p style={styles.switchText}>
              {authMode === "login"
                ? "Account nahi hai? "
                : "Pehle se account hai? "}
              <span
                style={styles.switchLink}
                onClick={() => setAuthMode(
                  authMode === "login" ? "register" : "login"
                )}
              >
                {authMode === "login" ? "Register karo" : "Login karo"}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ⭐ Login ke baad — Chat dikha
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerText}>🏪 Ahmed Perfume Shop</h2>
        <div style={styles.headerBottom}>
          <div style={styles.nav}>
            <button
              style={{
                ...styles.navBtn,
                background: page === "chat"
                  ? "rgba(255,255,255,0.3)"
                  : "transparent"
              }}
              onClick={() => setPage("chat")}
            >
              💬 Chat
            </button>
            <button
              style={{
                ...styles.navBtn,
                background: page === "products"
                  ? "rgba(255,255,255,0.3)"
                  : "transparent"
              }}
              onClick={() => setPage("products")}
            >
              🛍️ Products
            </button>
            
            <button
            style={{
              ...styles.navBtn,
              background: page === "content"
                ? "rgba(255,255,255,0.3)"
                : "transparent"
            }}
            
            onClick={() => setPage("content")}
          >
          
            ✍️ Content
          </button>

          <button
            style={{
              ...styles.navBtn,
              background: page === "dashboard"
                ? "rgba(255,255,255,0.3)"
                : "transparent"
            }}
            onClick={() => setPage("dashboard")}
          >
            📊 Dashboard
          </button>
          
          </div>
          {/* User info + Logout */}
          <div style={styles.userInfo}>
            <span style={styles.userName}>
              👤 {user.name}
            </span>
            <button
              style={styles.logoutBtn}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Pages */}
      {page === "chat" ? (
        <>
          <div style={styles.chatBox}>
            {messages.length === 0 && (
              <p style={styles.placeholder}>
                Assalamualaikum {user.name}! 👋
                <br />
                <span style={{ fontSize: "13px" }}>
                  Koi bhi sawal poocho 😄
                </span>
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={
                msg.role === "user"
                  ? styles.userMessage
                  : styles.aiMessage
              }>
                <span style={styles.messageRole}>
                  {msg.role === "user" ? "👤 Tum" : "🤖 AI"}
                </span>
                <p style={styles.messageText}>{msg.content}</p>
              </div>
            ))}
            {loading && (
              <div style={styles.aiMessage}>
                <p style={styles.messageText}>
                  ⏳ Soch raha hoon...
                </p>
              </div>
            )}
          </div>
          <div style={styles.inputBox}>
            <input
              style={styles.input}
              type="text"
              placeholder="Yahan likho..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              style={styles.button}
              onClick={() => sendMessage()}
              disabled={loading}
            >
              Send 🚀
            </button>
          </div>
        </>
           ) : page === "products" ? (
            <Products onProductClick={handleProductClick} />
          ) : page === "content" ? (
            <ContentGenerator token={token} />
          ) : (
            <Dashboard token={token} />
          )}
          </div>
        );
      }

// ⭐ Styles
const styles = {
  // Auth styles
  authContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  authBox: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    width: "380px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
  },
  authHeader: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "25px",
    textAlign: "center"
  },
  authTitle: {
    color: "white",
    margin: 0,
    fontSize: "22px"
  },
  authSubtitle: {
    color: "rgba(255,255,255,0.8)",
    margin: "5px 0 0",
    fontSize: "14px"
  },
  authForm: {
    padding: "25px"
  },
  formTitle: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px"
  },
  authInput: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box"
  },
  errorText: {
    color: "red",
    fontSize: "13px",
    textAlign: "center"
  },
  authButton: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "5px"
  },
  switchText: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    marginTop: "15px"
  },
  switchLink: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "bold"
  },
  // Chat styles
  container: {
    maxWidth: "700px",
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  },
  header: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "15px 20px"
  },
  headerText: {
    color: "white",
    margin: "0 0 10px",
    fontSize: "20px",
    textAlign: "center"
  },
  headerBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  nav: {
    display: "flex",
    gap: "8px"
  },
  navBtn: {
    color: "white",
    border: "1px solid rgba(255,255,255,0.4)",
    padding: "6px 15px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px"
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  userName: {
    color: "white",
    fontSize: "13px"
  },
  logoutBtn: {
    background: "rgba(255,255,255,0.2)",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "12px"
  },
  chatBox: {
    height: "420px",
    overflowY: "auto",
    padding: "20px",
    background: "#f9f9f9"
  },
  placeholder: {
    textAlign: "center",
    color: "#aaa",
    marginTop: "130px",
    lineHeight: "2"
  },
  userMessage: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    padding: "12px",
    borderRadius: "12px 12px 0 12px",
    marginBottom: "10px",
    marginLeft: "60px"
  },
  aiMessage: {
    background: "white",
    color: "#333",
    padding: "12px",
    borderRadius: "12px 12px 12px 0",
    marginBottom: "10px",
    marginRight: "60px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },
  messageRole: {
    fontSize: "12px",
    fontWeight: "bold",
    opacity: 0.8
  },
  messageText: {
    margin: "5px 0 0",
    lineHeight: "1.5"
  },
  inputBox: {
    display: "flex",
    padding: "15px",
    background: "white",
    borderTop: "1px solid #eee",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "25px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none"
  },
  button: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
  }
};

export default App;