import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("user", JSON.stringify(res.data.data));

      alert("Login successful");
      navigate("/games");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h2>🔐 Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>

      {/* 🔥 REGISTER LINK */}
      <p style={{ marginTop: "15px" }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "#4cafef", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register here
        </span>
      </p>

      {/* 🔥 FORGOT PASSWORD */}
      <p>
        <Link to="/reset-password">Forgot Password?</Link>
      </p>
    </div>
  );
}