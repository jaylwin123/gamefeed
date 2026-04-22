require("dotenv").config({
  path: require("path").join(__dirname, "../../server/.env"),
});
const { createClient } = require("@libsql/client");

const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Steam CDN headers — sin API key, URLs permanentes y sin CORS
const STEAM_CDN = "https://cdn.akamai.steamstatic.com/steam/apps";
const IMAGES = {
  "Elden Ring": `${STEAM_CDN}/1245620/header.jpg`,
  Cyberpunk: `${STEAM_CDN}/1091500/header.jpg`,
  "Xbox Showcase": `${STEAM_CDN}/2767030/header.jpg`, // Starfield como representativo Xbox
  Baldur: `${STEAM_CDN}/1086940/header.jpg`,
};

async function fixImages() {
  const result = await db.execute(
    "SELECT id, content FROM newsletters ORDER BY edition DESC LIMIT 1",
  );

  if (!result.rows.length) {
    console.log("No hay newsletters en la DB.");
    process.exit(0);
  }

  const row = result.rows[0];
  const content = JSON.parse(row.content);

  content.news = content.news.map((item) => {
    const key = Object.keys(IMAGES).find((k) => item.title.includes(k));
    if (key) {
      item.image = IMAGES[key];
      console.log(`✓ ${item.title} → ${item.image}`);
    } else {
      console.log(`✗ Sin imagen para: ${item.title}`);
    }
    return item;
  });

  await db.execute({
    sql: "UPDATE newsletters SET content = ? WHERE id = ?",
    args: [JSON.stringify(content), row.id],
  });

  console.log("\nNewsletter actualizado en Turso.");
  process.exit(0);
}

fixImages().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
