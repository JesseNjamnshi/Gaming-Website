import { useEffect, useState } from "react";
import API from "../services/api";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchWishlist = async () => {
    try {
      const res = await API.get(`/wishlist/${user.user_id}`);
      setWishlist(res.data.data);
    } catch {
      alert("Error loading wishlist");
    }
  };

  const removeFromWishlist = async (gameId) => {
    try {
      await API.delete(`/wishlist`, {
        data: {
          user_id: user.user_id,
          game_id: gameId
        }
      });

      fetchWishlist();
    } catch {
      alert("Error removing");
    }
  };

  const addToCart = (game) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(game);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart");
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>❤️ Wishlist</h1>

      {wishlist.length === 0 && <p>No items in wishlist</p>}

      {wishlist.map((game, index) => (
        <div
          key={game.game_id}
          style={{
            display: "flex",
            alignItems: "center",
            background: "#2a475e",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px"
          }}
        >
          {/* IMAGE */}
          <img
            src={game.image_url}
            alt={game.title}
            style={{
              width: "250px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "5px"
            }}
          />

          {/* INFO */}
          <div style={{ flex: 1, marginLeft: "20px" }}>
            <h2>{game.title}</h2>

            {/* GENRES */}
            <div style={{ marginBottom: "10px" }}>
              {game.genres &&
                game.genres.split(",").map((g, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#1b2838",
                      padding: "4px 8px",
                      marginRight: "5px",
                      borderRadius: "4px",
                      fontSize: "12px"
                    }}
                  >
                    {g}
                  </span>
                ))}
            </div>

            {/* EXTRA INFO */}
            <p style={{ fontSize: "13px", color: "#ccc" }}>
              Release Date: {game.release_date?.split("T")[0]}
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div style={{ textAlign: "right" }}>
            <h3 style={{ marginBottom: "10px" }}>${game.price}</h3>

            <button
              onClick={() => addToCart(game)}
              style={{
                background: "#5c7e10",
                color: "white",
                border: "none",
                padding: "8px 12px",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              Add to Cart
            </button>

            <br />

            <button
              onClick={() => removeFromWishlist(game.game_id)}
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
    </div>
  );
}