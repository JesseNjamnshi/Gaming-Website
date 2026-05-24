import { useEffect, useState } from "react";
import API from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeFromCart = (gameId) => {
    const updated = cart.filter((g) => g.game_id !== gameId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const checkout = async () => {
    try {
      await API.post("/orders", {
        user_id: user.user_id,
        games: cart.map((g) => ({
          game_id: g.game_id
        }))
      });

      alert("Purchase successful!");

      localStorage.removeItem("cart");
      setCart([]);

    } catch {
      alert("Checkout failed");
    }
  };

  const total = cart.reduce((sum, g) => sum + Number(g.price), 0);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>🛒 Cart</h1>

      {cart.length === 0 && <p>Your cart is empty</p>}

      {cart.map((game) => (
        <div
          key={game.game_id}
          style={{
            display: "flex",
            alignItems: "center",
            background: "#2a475e",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <img
            src={game.image_url}
            alt={game.title}
            style={{
              width: "150px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "5px"
            }}
          />

          <div style={{ flex: 1, marginLeft: "15px" }}>
            <h3>{game.title}</h3>
          </div>

          <div style={{ textAlign: "right" }}>
            <p>${game.price}</p>

            <button
              onClick={() => removeFromCart(game.game_id)}
              style={{
                background: "#3a3f44",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer"
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* TOTAL */}
      {cart.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Total: ${total.toFixed(2)}</h2>

          <button
            onClick={checkout}
            style={{
              background: "#5c7e10",
              color: "white",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer"
            }}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}