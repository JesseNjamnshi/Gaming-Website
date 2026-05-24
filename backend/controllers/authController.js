const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// ================= REGISTER =================
exports.register = async (req, res) => {
    const { username, email, password, bio, profile_picture } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Username, email, and password are required"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔐 generate verification token
        const token = crypto.randomBytes(32).toString("hex");

        const sql = `
            INSERT INTO users 
            (username, email, password_hash, bio, profile_picture, is_verified, verification_token)
            VALUES (?, ?, ?, ?, ?, 0, ?)
        `;

        db.query(
            sql,
            [username, email, hashedPassword, bio || null, profile_picture || null, token],
            (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({
                            success: false,
                            message: "Email already exists"
                        });
                    }

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                const verifyLink = `http://localhost:5001/api/auth/verify/${token}`;

                res.status(201).json({
                    success: true,
                    message: "User registered. Verify email.",
                    verifyLink
                });
            }
        );

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= VERIFY EMAIL =================
exports.verifyEmail = (req, res) => {
    const { token } = req.params;

    const sql = `
        UPDATE users
        SET is_verified = 1, verification_token = NULL
        WHERE verification_token = ?
    `;

    db.query(sql, [token], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        res.json({
            success: true,
            message: "Email verified successfully"
        });
    });
};

// ================= LOGIN =================
exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = results[0];

        // ❗ BLOCK if not verified
        if (user.is_verified === 0) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first"
            });
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            data: {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            }
        });
    });
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    const hashed = await bcrypt.hash(newPassword, 10);

    const sql = `
        UPDATE users SET password_hash = ?
        WHERE email = ?
    `;

    db.query(sql, [hashed, email], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "Password updated"
        });
    });
};