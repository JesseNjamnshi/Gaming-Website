import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Games() {
  const [games, setGames] = useState([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchGames = async () => {
    try {
      setLoading(true);

      let url = "/games";
      const params = [];

      if (title.trim() !== "") {
        params.push(`title=${title}`);
      }

      if (genre.trim() !== "") {
        params.push(`genre=${genre}`);
      }

      if (params.length > 0) {
        url += "?" + params.join("&");
      }

      const res = await API.get(url);
      setGames(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching games");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (gameId) => {
    try {
      await API.post("/wishlist", {
        user_id: user.user_id,
        game_id: gameId
      });
      alert("Added to wishlist");
    } catch {
      alert("Error adding to wishlist");
    }
  };

  const buyGame = async (gameId) => {
    try {
      await API.post("/orders", {
        user_id: user.user_id,
        games: [{ game_id: gameId }]
      });
      alert("Purchase successful");
    } catch {
      alert("Error purchasing game");
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎮 Game Store</h1>

      {/* SEARCH + FILTER */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Search game..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="">All Genres</option>
          <option value="FPS">FPS</option>
          <option value="Sports">Sports</option>
          <option value="Sandbox">Sandbox</option>
        </select>

        <button onClick={fetchGames} style={{ marginLeft: "10px" }}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* GAMES GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px"
        }}
      >
        {games.map((game) => (
          <div
            key={game.game_id}
            onClick={() => navigate(`/games/${game.game_id}`)}
            style={{
              position: "relative",
              height: "180px",
              borderRadius: "12px",
              overflow: "hidden",
              cursor: "pointer",
              backgroundImage: `url(${
                game.image_url || "https://via.placeholder.com/400x200"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "0.3s"
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            {/* DARK OVERLAY */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)"
              }}
            />

            {/* TEXT */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                color: "white"
              }}
            >
              <h3 style={{ margin: 0 }}>{game.title}</h3>
              <p style={{ margin: 0, color: "#4cafef" }}>
                ${game.price}
              </p>
            </div>

            {/* BUTTONS */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px"
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  buyGame(game.game_id);
                }}
              >
                Buy
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToWishlist(game.game_id);
                }}
                style={{ marginLeft: "5px" }}
              >
                Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}