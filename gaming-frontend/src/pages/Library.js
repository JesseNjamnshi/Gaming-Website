import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const [games, setGames] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchLibrary = async () => {
    try {
      const res = await API.get(`/library/${user.user_id}`);
      setGames(res.data.data);
    } catch {
      alert("Error loading library");
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>🎮 My Library</h1>

      {games.length === 0 && <p>No games owned</p>}

      {games.map((game) => (
        <div
          key={game.game_id}
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1b2838",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
            transition: "0.2s"
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#2a475e")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#1b2838")
          }
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

            {/* FAKE STATS (for now) */}
            <p style={{ color: "#ccc", fontSize: "13px" }}>
              Total Played: {Math.floor(Math.random() * 50)} hrs
            </p>

            <p style={{ color: "#ccc", fontSize: "13px" }}>
              Last Played: Recently
            </p>
          </div>

          {/* ACTIONS */}
          <div>
            <button
              onClick={() => navigate(`/games/${game.game_id}`)}
              style={{
                background: "#5c7e10",
                color: "white",
                border: "none",
                padding: "10px 15px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              View
            </button>

            <button
              style={{
                background: "#3a3f44",
                color: "white",
                border: "none",
                padding: "10px 15px",
                cursor: "pointer"
              }}
            >
              Play
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}