import { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");

  //////////////////////////
  // FETCH DATA
  //////////////////////////
  const fetchProfile = async () => {
    const res = await API.get(`/users/${user.user_id}`);
    setProfile(res.data.data);
  };

  const fetchActivity = async () => {
    const res = await API.get(`/users/${user.user_id}/activity`);
    setActivity(res.data.data);
  };

  const fetchReviews = async () => {
    const res = await API.get(`/users/${user.user_id}/reviews`);
    setReviews(res.data.data);
  };

  //////////////////////////
  // UPDATE PROFILE
  //////////////////////////
  const updateProfile = async () => {
    await API.put(`/users/${user.user_id}`, {
      profile_picture: image,
      bio: bio
    });

    alert("Profile updated");
    fetchProfile();
  };

  //////////////////////////
  // ONLINE STATUS UPDATE
  //////////////////////////
  const updateActive = async () => {
    await API.put(`/users/${user.user_id}/active`);
  };

  //////////////////////////
  // ONLINE STATUS CHECK
  //////////////////////////
  const getStatus = () => {
    if (!profile?.last_active) return "Offline";

    const last = new Date(profile.last_active);
    const now = new Date();

    const diff = (now - last) / 1000;

    if (diff < 60) return "🟢 Online";
    if (diff < 300) return "🟡 Away";

    return "⚫ Offline";
  };

  useEffect(() => {
    fetchProfile();
    fetchActivity();
    fetchReviews();
    updateActive();

    const interval = setInterval(updateActive, 30000); // every 30 sec

    return () => clearInterval(interval);
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #1b2838, #171a21, #1b2838)",
        color: "white"
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", gap: "30px" }}>
        <img
          src={
            profile.profile_picture ||
            "https://via.placeholder.com/150"
          }
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "10px"
          }}
        />

        <div>
          <h1>{profile.username}</h1>
          <p>{profile.bio || "No bio yet"}</p>
          <p>{getStatus()}</p>
          <p>Level: 3</p>
        </div>

        {/* SIDE PANEL */}
        <div
          style={{
            marginLeft: "auto",
            background: "#1e1e1e",
            padding: "20px",
            borderRadius: "10px"
          }}
        >
          <h3>Profile Info</h3>
          <p>Games: {profile.total_games}</p>
        </div>
      </div>

      {/* EDIT PROFILE */}
      <div style={{ marginTop: "20px" }}>
        <input
          placeholder="Profile image URL"
          onChange={(e) => setImage(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="Bio"
          onChange={(e) => setBio(e.target.value)}
        />

        <br /><br />

        <button onClick={updateProfile}>Save</button>
      </div>

      {/* ACTIVITY */}
      <div style={{ marginTop: "40px" }}>
        <h3>Recent Activity</h3>

        {activity.map((g, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <img src={g.image_url} style={{ width: "80px" }} />
            <span>{g.title}</span>
          </div>
        ))}
      </div>

      {/* REVIEWS ⭐ */}
      <div style={{ marginTop: "40px" }}>
        <h3>Your Reviews</h3>

        {reviews.map((r, i) => (
          <div key={i} style={{ marginTop: "10px" }}>
            <strong>{r.title}</strong> ({r.rating}⭐)
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}