import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function PurchaseHistory() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get(`/orders/history/${user.user_id}`);
    setOrders(res.data.data);
  };

  const requestRefund = async (orderId) => {
    await API.put(`/orders/request-refund/${orderId}`);
    alert("Refund requested");
    fetchOrders();
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>🧾 Purchase History</h2>

      {orders.map(order => (
        <div
          key={order.order_id}
          style={{
            background: "#1b2838",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px"
          }}
        >
          <p><strong>Order ID:</strong> {order.order_id}</p>
          <p><strong>Games:</strong> {order.games}</p>
          <p><strong>Total:</strong> ${order.total_amount}</p>

          {/* STATUS */}
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: getStatusColor(order.status) }}>
              {order.status}
            </span>
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>

          {/* 🎯 ACTION BUTTONS */}
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>

            {/* 📄 VIEW RECEIPT */}
            <button onClick={() => navigate(`/receipt/${order.order_id}`)}>
              View Receipt
            </button>

            {/* 💸 REFUND */}
            {order.status === "paid" && (
              <button onClick={() => requestRefund(order.order_id)}>
                Request Refund
              </button>
            )}

          </div>
        </div>
      ))}
    </div>
  );
}

/* 🔥 helper */
const getStatusColor = (status) => {
  if (status === "paid") return "#4caf50";
  if (status === "refund_requested") return "#ff9800";
  if (status === "refunded") return "#f44336";
  return "#ccc";
};