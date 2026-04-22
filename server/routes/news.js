const express = require("express");
const router = express.Router();
const { db } = require("../db/database");
const {
  authenticate,
  authenticateRoutine,
} = require("../middleware/authMiddleware");

const DEFAULT_CONTENT = {
  news: [
    {
      category: "LANZAMIENTO",
      title: "Elden Ring: Shadow of the Erdtree llega el 21 de junio",
      description:
        "La expansion mas esperada del ano promete doblar el contenido base con una nueva region y jefes ineditos.",
      platform: "PC / PS5 / Xbox",
      image:
        "https://media.rawg.io/media/games/b29/b294bfc5688cb07c41c0b5524fe2082b.jpg",
    },
    {
      category: "EXPANSION",
      title: "Cyberpunk 2077: Phantom Liberty supera 8 millones de copias",
      description:
        "CD Projekt RED anuncia que el DLC se convirtio en el mas vendido de su historia.",
      platform: "PC / Consolas",
      image:
        "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8bb94a3.jpg",
    },
    {
      category: "INDUSTRIA",
      title: "Microsoft confirma Xbox Showcase para mayo 2025",
      description:
        "El evento revelara los proximos titulos de Game Pass y posibles anuncios de hardware.",
      platform: "Xbox / PC",
      image:
        "https://media.rawg.io/media/games/f87/f87457e8347484033cb34cde6101d08d.jpg",
    },
    {
      category: "ACTUALIZACION",
      title: "Baldur Gate 3 recibe el Parche 7 con nuevo final",
      description:
        "Larian Studios sorprende con contenido gratuito que anade mas de 10 horas de juego extra.",
      platform: "PC / PS5",
      image:
        "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be85.jpg",
    },
  ],
  deals: [
    {
      store: "Steam",
      game: "Cyberpunk 2077",
      originalPrice: "$59.99",
      discountPrice: "$17.99",
      discount: "70%",
    },
    {
      store: "Epic",
      game: "Satisfactory",
      originalPrice: "$29.99",
      discountPrice: "$14.99",
      discount: "50%",
    },
    {
      store: "PS Store",
      game: "God of War Ragnarok",
      originalPrice: "$69.99",
      discountPrice: "$34.99",
      discount: "50%",
    },
  ],
  pick: {
    title: "Hades II",
    platforms: ["PC", "Early Access"],
    description:
      "Supergiant Games regresa con una secuela que supera en todo a su predecesor. Combate mas fluido, narrativa mas profunda y una roguelite que no podras soltar.",
    score: 9,
    pros: [
      "Combate adictivo y fluido",
      "Arte visual espectacular",
      "Historia envolvente",
    ],
    cons: ["Aun en Early Access", "Curva de dificultad alta"],
  },
  poll: {
    question: "Cual es el genero que mas estas jugando este ano?",
    options: [
      "RPG / JRPG",
      "FPS / Accion",
      "Roguelite / Indie",
      "Multijugador / Battle Royale",
    ],
    votes: [0, 0, 0, 0],
  },
};

async function seedDefaultNewsletter() {
  const result = await db.execute("SELECT id FROM newsletters LIMIT 1");
  if (result.rows.length > 0) return;
  await db.execute({
    sql: "INSERT INTO newsletters (edition, date, content) VALUES (?, ?, ?)",
    args: [
      1,
      new Date().toISOString().split("T")[0],
      JSON.stringify(DEFAULT_CONTENT),
    ],
  });
}

// GET /api/news/history
router.get("/history", authenticate, async (req, res) => {
  try {
    const result = await db.execute(
      "SELECT id, edition, date FROM newsletters ORDER BY edition DESC",
    );
    return res.json(
      result.rows.map((r) => ({
        id: Number(r.id),
        edition: Number(r.edition),
        date: r.date,
      })),
    );
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/news/latest
router.get("/latest", authenticate, async (req, res) => {
  try {
    const result = await db.execute(
      "SELECT * FROM newsletters ORDER BY edition DESC LIMIT 1",
    );
    const newsletter = result.rows[0];
    if (!newsletter)
      return res.status(404).json({ error: "No hay newsletter disponible" });
    return res.json({
      ...newsletter,
      id: Number(newsletter.id),
      edition: Number(newsletter.edition),
      content: JSON.parse(newsletter.content),
    });
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/news/:id  — debe ir DESPUÉS de las rutas con nombres fijos
router.get("/:id", authenticate, async (req, res) => {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM newsletters WHERE id = ?",
      args: [req.params.id],
    });
    const newsletter = result.rows[0];
    if (!newsletter)
      return res.status(404).json({ error: "Newsletter no encontrado" });
    return res.json({
      ...newsletter,
      id: Number(newsletter.id),
      edition: Number(newsletter.edition),
      content: JSON.parse(newsletter.content),
    });
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/news/schema
router.get("/schema", (req, res) => {
  return res.json({
    endpoint: "POST /api/news/publish",
    auth: "Bearer <ROUTINES_API_KEY>",
    body: {
      edition: "number",
      news: [
        {
          category: "LANZAMIENTO|EXPANSION|INDUSTRIA|ACTUALIZACION",
          title: "string",
          description: "string",
          platform: "string",
          image:
            "string — URL directa de imagen del juego (opcional, usar Steam CDN: https://cdn.akamai.steamstatic.com/steam/apps/{ID}/header.jpg)",
          fullDescription:
            "string — texto completo de la noticia, 3-5 oraciones con todos los detalles (opcional pero recomendado)",
          url: "string — URL de la fuente original de la noticia (IGN, Eurogamer, web oficial, etc.)",
          source:
            "string — nombre de la fuente, ej: IGN, Eurogamer, PlayStation Blog",
        },
      ],
      deals: [
        {
          store: "Steam|Epic|PS Store",
          game: "string",
          originalPrice: "string",
          discountPrice: "string",
          discount: "string",
          url: "string — URL directa a la pagina del juego en la tienda oficial",
        },
      ],
      pick: {
        title: "string",
        platforms: ["string"],
        description: "string",
        score: "number 1-10",
        pros: ["string"],
        cons: ["string"],
      },
      poll: {
        question: "string",
        options: ["string max 4"],
        votes: [0, 0, 0, 0],
      },
    },
  });
});

// POST /api/news/publish
router.post("/publish", authenticateRoutine, async (req, res) => {
  const { edition, news, deals, pick, poll } = req.body;
  if (!edition || !news || !deals || !pick || !poll) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }
  try {
    const content = JSON.stringify({ news, deals, pick, poll });
    const date = new Date().toISOString().split("T")[0];
    const result = await db.execute({
      sql: "INSERT INTO newsletters (edition, date, content) VALUES (?, ?, ?)",
      args: [edition, date, content],
    });
    return res.status(201).json({
      message: "Newsletter publicado",
      id: Number(result.lastInsertRowid),
    });
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/news/poll-vote
router.post("/poll-vote", authenticate, async (req, res) => {
  const { newsletterId, optionIndex } = req.body;
  const userId = req.user.id;
  try {
    const nlResult = await db.execute({
      sql: "SELECT * FROM newsletters WHERE id = ?",
      args: [newsletterId],
    });
    const newsletter = nlResult.rows[0];
    if (!newsletter)
      return res.status(404).json({ error: "Newsletter no encontrado" });

    const voteResult = await db.execute({
      sql: "SELECT id FROM poll_votes WHERE user_id = ? AND newsletter_id = ?",
      args: [userId, newsletterId],
    });
    if (voteResult.rows.length > 0)
      return res.status(409).json({ error: "Ya has votado en esta encuesta" });

    await db.execute({
      sql: "INSERT INTO poll_votes (user_id, newsletter_id, option_index) VALUES (?, ?, ?)",
      args: [userId, newsletterId, optionIndex],
    });

    const content = JSON.parse(newsletter.content);
    const votes = new Array(content.poll.options.length).fill(0);
    const allVotes = await db.execute({
      sql: "SELECT option_index FROM poll_votes WHERE newsletter_id = ?",
      args: [newsletterId],
    });
    allVotes.rows.forEach((v) => votes[Number(v.option_index)]++);
    return res.json({ votes });
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = { router, seedDefaultNewsletter };
