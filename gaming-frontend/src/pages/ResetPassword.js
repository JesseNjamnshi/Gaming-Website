import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await API.put("/auth/reset-password", {
        email,
        newPassword
      });

      alert("Password updated successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reset Password</h2>

      <input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}