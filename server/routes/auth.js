const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const JWT_SECRET = process.env.JWT_SECRET || "gamefeed_super_secret_key_2024";
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }
  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({
      error:
        "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial (!@#$%^&*)",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    db.prepare(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    ).run(username, email, passwordHash);
    return res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (err) {
    if (err.message && err.message.includes("UNIQUE")) {
      return res
        .status(409)
        .json({ error: "El email o nombre de usuario ya existe" });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
