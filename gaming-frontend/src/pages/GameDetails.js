import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function GameDetails() {
  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchGame();
    fetchReviews();
  }, [id]);

  const fetchGame = async () => {
    const res = await API.get(`/games/${id}`);
    setGame(res.data.data);
  };

  const fetchReviews = async () => {
    const res = await API.get(`/reviews/${id}`);
    setReviews(res.data.data);
  };

  const submitReview = async () => {
    await API.post("/reviews", {
      user_id: user.user_id,
      game_id: id,
      rating,
      comment
    });

    setComment("");
    fetchReviews();
  };

  if (!game) return <p>Loading...</p>;

  const getYoutubeThumbnail = (url) => {
    if (!url) return "";
    const id = url.split("/embed/")[1];
    return `https://img.youtube.com/vi/${id}/0.jpg`;
  };

  const images = game.images
    ? game.images.split(",")
    : [game.image_url];

  const media = [
    ...(game.gameplay_url ? [{ type: "video", url: game.gameplay_url }] : []),
    ...images.map(img => ({ type: "image", url: img }))
  ];

  const selected = media[selectedIndex];

  const next = () =>
    setSelectedIndex((prev) => (prev + 1) % media.length);

  const prev = () =>
    setSelectedIndex((prev) =>
      prev === 0 ? media.length - 1 : prev - 1
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${game.image_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative"
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.9), rgba(20,30,50,0.7))",
          backdropFilter: "blur(6px)"
        }}
      />

      <div style={{ position: "relative", padding: "20px", color: "white" }}>
        <h1>{game.title}</h1>

        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

          {/* LEFT SIDE */}
          <div style={{ flex: 2 }}>

            {/* MEDIA */}
            <div style={{ position: "relative" }}>
              <button onClick={prev} style={arrowLeft}>◀</button>
              <button onClick={next} style={arrowRight}>▶</button>

              {selected.type === "video" ? (
                <iframe
                  src={selected.url}
                  title="video"
                  style={videoStyle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img src={selected.url} alt="" style={videoStyle} />
              )}
            </div>

            {/* THUMBNAILS */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {media.map((m, i) => (
                <img
                  key={i}
                  src={m.type === "video" ? getYoutubeThumbnail(m.url) : m.url}
                  onClick={() => setSelectedIndex(i)}
                  style={{
                    width: "120px",
                    height: "70px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      selectedIndex === i
                        ? "2px solid #4cafef"
                        : "2px solid transparent",
                    borderRadius: "5px"
                  }}
                />
              ))}
            </div>

            {/* ⭐ REVIEWS NOW DIRECTLY UNDER MEDIA */}
            <div style={{ marginTop: "20px" }}>
              <h3>Leave a Review</h3>

              {[1,2,3,4,5].map(star => (
                <span key={star} onClick={() => setRating(star)} style={starStyle(star, rating)}>★</span>
              ))}

              <br />

              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write review..."
              />

              <button onClick={submitReview}>Submit</button>
            </div>

            <hr />

            <h3>Reviews</h3>
            {reviews.map(r => (
              <div key={r.review_id}>
                <strong>{r.username}</strong> ({r.rating}⭐)
                <p>{r.comment}</p>
              </div>
            ))}
          </div>

          {/* RIGHT PANEL */}
          <div style={{ flex: 1 }}>
            <img src={game.image_url} alt="" style={{ width: "100%", borderRadius: "10px" }} />

            <p>{game.description}</p>

            <div>
              {game.genres?.split(",").map((g, i) => (
                <span key={i} style={tagStyle}>{g}</span>
              ))}
            </div>

            <div style={{ marginTop: "15px" }}>
              <p>
                <strong>Release Date:</strong>{" "}
                {game.release_date &&
                  new Date(game.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
              </p>

              <p>
                <strong>Developer:</strong>{" "}
                {game.developer_website ? (
                  <a href={game.developer_website} target="_blank" rel="noreferrer" style={link}>
                    {game.developer}
                  </a>
                ) : game.developer}
              </p>

              <p>
                <strong>Publisher:</strong>{" "}
                {game.publisher_website ? (
                  <a href={game.publisher_website} target="_blank" rel="noreferrer" style={link}>
                    {game.publisher}
                  </a>
                ) : game.publisher}
              </p>
            </div>

            <h3>${game.price}</h3>
            <button>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const videoStyle = {
  width: "100%",
  height: "60vh",
  maxHeight: "650px",
  minHeight: "450px",
  borderRadius: "10px",
  border: "none",
  objectFit: "contain", // ✅ FIXED
  backgroundColor: "#000" // ✅ prevents ugly gaps
};

const arrowLeft = {
  position: "absolute",
  left: 10,
  top: "50%",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  border: "none",
  padding: "10px",
  cursor: "pointer"
};

const arrowRight = {
  position: "absolute",
  right: 10,
  top: "50%",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  border: "none",
  padding: "10px",
  cursor: "pointer"
};

const tagStyle = {
  background: "#333",
  padding: "5px 8px",
  marginRight: "5px",
  borderRadius: "5px",
  fontSize: "12px"
};

const link = {
  color: "#4cafef",
  textDecoration: "none"
};

const starStyle = (star, rating) => ({
  cursor: "pointer",
  fontSize: "20px",
  color: star <= rating ? "gold" : "gray"
});