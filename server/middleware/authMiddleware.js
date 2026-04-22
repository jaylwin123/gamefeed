const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "gamefeed_super_secret_key_2024";
const ROUTINES_API_KEY = process.env.ROUTINES_API_KEY || "";

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// Si hay token lo valida, si no hay continúa con req.user = null
function authenticateOptional(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    req.user = null;
  }
  next();
}

// Acepta JWT de usuario O API Key de Routines de Cloud
function authenticateRoutine(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Autorización requerida" });
  }

  const token = authHeader.split(" ")[1];

  // Primero prueba como API Key de Routines
  if (ROUTINES_API_KEY && token === ROUTINES_API_KEY) {
    req.user = { id: 0, username: "routine", isRoutine: true };
    return next();
  }

  // Luego prueba como JWT normal
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token o API Key inválidos" });
  }
}

module.exports = { authenticate, authenticateOptional, authenticateRoutine };
