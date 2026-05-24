import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function Receipt() {
  const { id } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchReceipt();
  }, []);

  const fetchReceipt = async () => {
    const res = await API.get(`/orders/receipt/${id}`);
    setItems(res.data.data);
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>🧾 Receipt #{id}</h2>

      {items.length === 0 ? (
        <p>No data found</p>
      ) : (
        <>
          {items.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              🎮 {item.title} — ${item.price}
            </div>
          ))}

          <hr />

          <h3>
            Total: $
            {items.reduce((sum, item) => sum + parseFloat(item.price), 0)}
          </h3>
        </>
      )}
    </div>
  );
}