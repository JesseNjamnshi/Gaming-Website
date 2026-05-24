import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [count, setCount] = useState(0);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const res = await API.get(`/notifications/${user.user_id}`);
      const unread = res.data.data.filter(n => !n.is_read).length;
      setCount(unread);
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // 🔄 auto refresh notifications every 5s
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "#222",
        color: "#fff",
        alignItems: "center"
      }}
    >
      {/* LEFT SIDE NAV */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/games" style={linkStyle}>Games</Link>
        <Link to="/wishlist" style={linkStyle}>Wishlist</Link>
        <Link to="/library" style={linkStyle}>Library</Link>
        <Link to="/profile" style={linkStyle}>Profile</Link>

        {/* 🧾(Purchase History) */}
        <Link to="/orders" style={linkStyle}>Orders</Link>


        {/* NOTIFICATIONS */}
        <Link to="/notifications" style={linkStyle}>
          Notifications{" "}
          {count > 0 && (
            <span style={badgeStyle}>{count}</span>
          )}
        </Link>

        <Link to="/cart" style={linkStyle}>Cart</Link>
      </div>

      {/* RIGHT SIDE USER */}
      <div>
        {user && (
          <span style={{ marginRight: "15px" }}>
            👤 {user.username}
          </span>
        )}

        <button onClick={logout} style={logoutStyle}>
          Logout
        </button>
      </div>
    </div>
  );
}

/* styles */
const linkStyle = {
  color: "#fff",
  textDecoration: "none"
};

const badgeStyle = {
  background: "red",
  borderRadius: "50%",
  padding: "3px 8px",
  fontSize: "12px",
  marginLeft: "5px"
};

const logoutStyle = {
  padding: "6px 10px",
  cursor: "pointer"
};