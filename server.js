const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Allow your frontend (Vercel) to call backend
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ------------------------------------------------------------
// CLOUD MYSQL CONNECTION (PlanetScale / Railway)
// ------------------------------------------------------------
const db = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to database
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to cloud MySQL database");
});

// ------------------------------------------------------------
// DEFAULT ROUTE FOR TESTING (IMPORTANT FOR RENDER)
// ------------------------------------------------------------
app.get("/", (req, res) => {
    res.send("Instanil API is running!");
});

// ------------------------------------------------------------
// LOGIN API (STORE USERNAME + PASSWORD)
// ------------------------------------------------------------
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).send("Missing username or password");
    }

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error("DB Insert Error:", err);
            return res.status(500).send("Database error");
        }

        res.send("User login saved successfully!");
    });
});

// ------------------------------------------------------------
// START SERVER (Render will use this PORT automatically)
// ------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
