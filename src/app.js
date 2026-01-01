const express = require("express");
const userRoutes = require("./routes/userRoutes");
const contentRoutes = require("./routes/contentRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const path = require("path");

const app = express();

app.use(express.json());

// API
app.use("/api/users", userRoutes);
app.use("/api/contents", contentRoutes);
app.use("/api/favorites", favoriteRoutes);

// Frontend (HTML)
app.use(express.static(path.join(__dirname, "../public")));

// SPA fallback (opsiyonel)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
