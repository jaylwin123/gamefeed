const express = require("express");
const router = express.Router();
const db = require("../db/database");
const {
  authenticate,
  authenticateRoutine,
} = require("../middleware/authMiddleware");

// Seed newsletter de ejemplo si la BD está vacía
function seedDefaultNewsletter() {
  const existing = db.prepare("SELECT id FROM newsletters LIMIT 1").get();
  if (existing) return;

  const defaultContent = {
    news: [
      {
        category: "LANZAMIENTO",
        title: "Elden Ring: Shadow of the Erdtree llega el 21 de junio",
        description:
          "La expansión más esperada del año promete doblar el contenido base con una nueva región y jefes inéditos.",
        platform: "PC / PS5 / Xbox",
      },
      {
        category: "EXPANSIÓN",
        title: "Cyberpunk 2077: Phantom Liberty supera 8 millones de copias",
        description:
          "CD Projekt RED anuncia que el DLC se convirtió en el más vendido de su historia.",
        platform: "PC / Consolas",
      },
      {
        category: "INDUSTRIA",
        title: "Microsoft confirma Xbox Showcase para mayo 2025",
        description:
          "El evento revelará los próximos títulos de Game Pass y posibles anuncios de hardware.",
        platform: "Xbox / PC",
      },
      {
        category: "ACTUALIZACIÓN",
        title: "Baldur's Gate 3 recibe el Parche 7 con nuevo final",
        description:
          "Larian Studios sorprende con contenido gratuito que añade más de 10 horas de juego extra.",
        platform: "PC / PS5",
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
        game: "God of War: Ragnarök",
        originalPrice: "$69.99",
        discountPrice: "$34.99",
        discount: "50%",
      },
    ],
    pick: {
      title: "Hades II",
      platforms: ["PC", "Early Access"],
      description:
        "Supergiant Games regresa con una secuela que supera en todo a su predecesor. Combate más fluido, narrativa más profunda y una roguelite que no podrás soltar.",
      score: 9,
      pros: [
        "Combate adictivo y fluido",
        "Arte visual espectacular",
        "Historia envolvente",
      ],
      cons: ["Aún en Early Access", "Curva de dificultad alta"],
    },
    poll: {
      question: "¿Cuál es el género que más estás jugando este año?",
      options: [
        "RPG / JRPG",
        "FPS / Acción",
        "Roguelite / Indie",
        "Multijugador / Battle Royale",
      ],
      votes: [0, 0, 0, 0],
    },
  };

  db.prepare(
    "INSERT INTO newsletters (edition, date, content) VALUES (?, ?, ?)",
  ).run(
    1,
    new Date().toISOString().split("T")[0],
    JSON.stringify(defaultContent),
  );
}

seedDefaultNewsletter();

// GET /api/news/latest
router.get("/latest", authenticate, (req, res) => {
  const newsletter = db
    .prepare("SELECT * FROM newsletters ORDER BY edition DESC LIMIT 1")
    .get();
  if (!newsletter) {
    return res.status(404).json({ error: "No hay newsletter disponible" });
  }
  return res.json({ ...newsletter, content: JSON.parse(newsletter.content) });
});

// GET /api/news/schema — Routines pueden consultar el formato esperado sin auth
router.get("/schema", (req, res) => {
  return res.json({
    endpoint: "POST /api/news/publish",
    auth: "Bearer <ROUTINES_API_KEY>",
    body: {
      edition: "number — número de edición (ej: 2)",
      news: [
        {
          category:
            "string — LANZAMIENTO | EXPANSIÓN | INDUSTRIA | ACTUALIZACIÓN",
          title: "string",
          description: "string",
          platform: "string — ej: PC / PS5 / Xbox",
        },
      ],
      deals: [
        {
          store: "string — Steam | Epic | PS Store",
          game: "string",
          originalPrice: "string — ej: $59.99",
          discountPrice: "string — ej: $29.99",
          discount: "string — ej: 50%",
        },
      ],
      pick: {
        title: "string",
        platforms: ["string"],
        description: "string",
        score: "number — 1 a 10",
        pros: ["string"],
        cons: ["string"],
      },
      poll: {
        question: "string",
        options: ["string — máximo 4 opciones"],
        votes: ["number — inicializar en 0 por cada opción"],
      },
    },
  });
});

// POST /api/news/publish — accesible con JWT de usuario O API Key de Routines
router.post("/publish", authenticateRoutine, (req, res) => {
  const { edition, news, deals, pick, poll } = req.body;
  if (!edition || !news || !deals || !pick || !poll) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }
  const content = JSON.stringify({ news, deals, pick, poll });
  const date = new Date().toISOString().split("T")[0];
  const result = db
    .prepare(
      "INSERT INTO newsletters (edition, date, content) VALUES (?, ?, ?)",
    )
    .run(edition, date, content);
  return res
    .status(201)
    .json({ message: "Newsletter publicado", id: result.lastInsertRowid });
});

// POST /api/news/poll-vote
router.post("/poll-vote", authenticate, (req, res) => {
  const { newsletterId, optionIndex } = req.body;
  const userId = req.user.id;

  const newsletter = db
    .prepare("SELECT * FROM newsletters WHERE id = ?")
    .get(newsletterId);
  if (!newsletter) {
    return res.status(404).json({ error: "Newsletter no encontrado" });
  }

  const existingVote = db
    .prepare(
      "SELECT id FROM poll_votes WHERE user_id = ? AND newsletter_id = ?",
    )
    .get(userId, newsletterId);
  if (existingVote) {
    return res.status(409).json({ error: "Ya has votado en esta encuesta" });
  }

  db.prepare(
    "INSERT INTO poll_votes (user_id, newsletter_id, option_index) VALUES (?, ?, ?)",
  ).run(userId, newsletterId, optionIndex);

  const content = JSON.parse(newsletter.content);
  const votes = new Array(content.poll.options.length).fill(0);
  const allVotes = db
    .prepare("SELECT option_index FROM poll_votes WHERE newsletter_id = ?")
    .all(newsletterId);
  allVotes.forEach((v) => votes[v.option_index]++);

  return res.json({ votes });
});

module.exports = router;
