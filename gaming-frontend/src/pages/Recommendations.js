import { useEffect, useState } from "react";
import API from "../services/api";

export default function Recommendations() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    API.get("/reviews/recommended/all")
      .then(res => setGames(res.data.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔥 Recommended Games</h2>

      {games.map(g => (
        <div key={g.game_id}>
          {g.title} - ⭐ {parseFloat(g.avg_rating).toFixed(1)}
        </div>
      ))}
    </div>
  );
}