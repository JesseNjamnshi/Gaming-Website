import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [verifyLink, setVerifyLink] = useState("");

  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", form);

      setVerifyLink(res.data.verifyLink);

    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verifyLink);
    alert("Link copied!");
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h2>📝 Create Account</h2>

      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />
      <br /><br />

      <button onClick={handleRegister}>Register</button>

      {/* 🔥 VERIFY SECTION */}
      {verifyLink && (
        <div
          style={{
            marginTop: "20px",
            background: "#1b2838",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          <p>✅ Account created!</p>
          <p>👉 Click to verify your email:</p>

          <a
            href={verifyLink}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#4cafef" }}
          >
            Verify Account
          </a>

          <br /><br />

          <button onClick={copyToClipboard}>
            Copy Link
          </button>

          <br /><br />

          <button onClick={() => navigate("/")}>
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}