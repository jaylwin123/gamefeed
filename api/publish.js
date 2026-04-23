// Vercel serverless function — proxy to Render backend
// Allows Routines (blocked by Render IP filter) to publish via Vercel
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Forward the Authorization header from the original request
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  try {
    const response = await fetch(
      "https://gamefeed.onrender.com/api/news/publish",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Proxy error", detail: err.message });
  }
}
