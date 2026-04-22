const express = require("express");
const router = express.Router();
const { db } = require("../db/database");
const {
  authenticate,
  authenticateOptional,
} = require("../middleware/authMiddleware");

// POST /api/games/:slug — registrar/actualizar info del juego (upsert)
router.post("/:slug", authenticate, async (req, res) => {
  const { slug } = req.params;
  const { title, image, platform } = req.body;
  try {
    await db.execute({
      sql: `INSERT INTO games (slug, title, image, platform)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(slug) DO UPDATE SET
              title = COALESCE(excluded.title, title),
              image = COALESCE(excluded.image, image),
              platform = COALESCE(excluded.platform, platform)`,
      args: [slug, title || slug, image || null, platform || null],
    });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/games/:slug — info del juego + avg rating + reviews
router.get("/:slug", authenticateOptional, async (req, res) => {
  const { slug } = req.params;
  const userId = req.user?.id ?? null;
  try {
    const gameRes = await db.execute({
      sql: "SELECT * FROM games WHERE slug = ?",
      args: [slug],
    });

    const reviewsRes = await db.execute({
      sql: `SELECT gr.id, gr.slug, gr.user_id, gr.rating, gr.body,
                   gr.created_at as createdAt, u.username
            FROM game_reviews gr
            JOIN users u ON gr.user_id = u.id
            WHERE gr.slug = ?
            ORDER BY gr.created_at DESC`,
      args: [slug],
    });

    const reviews = reviewsRes.rows;
    const myReview = reviews.find((r) => Number(r.user_id) === Number(userId));
    const avgRating = reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    const game = gameRes.rows[0] || null;

    return res.json({
      game,
      reviews,
      avgRating,
      myRating: myReview?.rating || null,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/games/:slug/reviews — enviar o actualizar review
router.post("/:slug/reviews", authenticate, async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.id;
  const { rating, body } = req.body;

  if (!rating || rating < 1 || rating > 10) {
    return res.status(400).json({ error: "Rating debe ser entre 1 y 10" });
  }
  if (!body?.trim()) {
    return res.status(400).json({ error: "La review no puede estar vacía" });
  }

  try {
    await db.execute({
      sql: `INSERT INTO game_reviews (slug, user_id, rating, body, created_at)
            VALUES (?, ?, ?, ?, datetime('now'))
            ON CONFLICT(slug, user_id) DO UPDATE SET
              rating = excluded.rating,
              body = excluded.body,
              created_at = excluded.created_at`,
      args: [slug, userId, rating, body.trim()],
    });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
