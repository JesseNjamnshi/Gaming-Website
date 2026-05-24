import { useState, useEffect } from "react";
import API from "../services/api";

export default function Reviews({ gameId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReviews = async () => {
    const res = await API.get(`/reviews/${gameId}`);
    setReviews(res.data.data);
  };

  const submitReview = async () => {
    await API.post("/reviews", {
      user_id: user.user_id,
      game_id: gameId,
      rating,
      comment
    });

    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      <h3>Reviews</h3>

      <select onChange={(e) => setRating(e.target.value)}>
        {[1,2,3,4,5].map(r => (
          <option key={r} value={r}>{r}⭐</option>
        ))}
      </select>

      <input
        placeholder="Write review..."
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={submitReview}>Submit</button>

      <hr />

      {reviews.map(r => (
        <div key={r.review_id}>
          <strong>{r.username}</strong> ({r.rating}⭐)
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}