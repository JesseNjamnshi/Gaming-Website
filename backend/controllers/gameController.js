const db = require("../config/db");

// 🔍 SEARCH + FILTER (GENRE + TITLE)
exports.searchGames = (req, res) => {
    const { title, genre } = req.query;

    let sql = `
        SELECT DISTINCT g.game_id, g.title, g.price, g.image_url
        FROM games g
        LEFT JOIN game_genres gg ON g.game_id = gg.game_id
        LEFT JOIN genres ge ON gg.genre_id = ge.genre_id
        WHERE 1=1
    `;

    const params = [];

    if (title && title.trim() !== "") {
        sql += " AND g.title LIKE ?";
        params.push(`%${title}%`);
    }

    if (genre && genre.trim() !== "") {
        sql += " AND ge.name = ?";
        params.push(genre);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("SQL ERROR:", err);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
};


// 🎮 GET GAME DETAILS (UPDATED WITH LINKS + GENRES)
exports.getGameById = (req, res) => {
    const gameId = req.params.id;

    const sql = `
        SELECT 
            g.*,
            d.name AS developer,
            d.website AS developer_website,
            p.name AS publisher,
            p.website AS publisher_website,
            GROUP_CONCAT(ge.name) AS genres
        FROM games g
        LEFT JOIN developers d ON g.developer_id = d.developer_id
        LEFT JOIN publishers p ON g.publisher_id = p.publisher_id
        LEFT JOIN game_genres gg ON g.game_id = gg.game_id
        LEFT JOIN genres ge ON gg.genre_id = ge.genre_id
        WHERE g.game_id = ?
        GROUP BY g.game_id
    `;

    db.query(sql, [gameId], (err, results) => {
        if (err) {
            console.error("SQL ERROR:", err);
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};