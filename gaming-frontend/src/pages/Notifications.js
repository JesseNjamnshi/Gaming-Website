import { useEffect, useState } from "react";
import API from "../services/api";

export default function Notifications() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get(`/notifications/${user.user_id}`);
      setNotifications(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error loading notifications");
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch {
      alert("Error updating notification");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h2>🔔 Notifications</h2>

      {notifications.length === 0 && <p>No notifications</p>}

      {notifications.map((n) => (
        <div
          key={n.notification_id}
          style={{
            background: n.is_read ? "#1e1e1e" : "#2c2c2c",
            padding: "15px",
            borderRadius: "10px",
            marginTop: "10px"
          }}
        >
          <p>{n.message}</p>

          {!n.is_read && (
            <button onClick={() => markAsRead(n.notification_id)}>
              Mark as read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}