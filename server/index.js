const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDB } = require("./db/database");
const authRoutes = require("./routes/auth");
const { router: newsRoutes, seedDefaultNewsletter } = require("./routes/news");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

initDB()
  .then(async () => {
    await seedDefaultNewsletter();
    app.listen(PORT, () => {
      console.log(`GameFeed server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error iniciando DB:", err);
    process.exit(1);
  });
