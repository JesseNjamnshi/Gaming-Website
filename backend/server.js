const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

console.log("🔥 THIS IS THE REAL SERVER FILE");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());

// =====================
// TEST ROUTE
// =====================
app.get("/api", (req, res) => {
    res.send("API is running...");
});

// =====================
// ROUTES
// =====================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/games", require("./routes/games"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/alerts", require("./routes/alerts"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/library", require("./routes/library"));
app.use("/api/users", require("./routes/users"));

// =====================
// FRONTEND (REACT BUILD)
// =====================

// serve static files
app.use(express.static(path.join(__dirname, "../gaming-frontend/build")));

// 🔥 FIXED FALLBACK (NO MORE CRASH)
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
        return next();
    }

    res.sendFile(path.join(__dirname, "../gaming-frontend/build/index.html"));
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});