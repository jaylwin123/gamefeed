const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

app.listen(PORT, () => {
  console.log(`GameFeed server running on http://localhost:${PORT}`);
});
