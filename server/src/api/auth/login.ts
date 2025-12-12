// server/src/api/auth/login.ts
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../../db/client");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES = "7d";

module.exports = async function login(req: any, res: any) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "missing email or password" });

    const r = await query("SELECT id, password_hash, username FROM users WHERE email=$1", [email]);
    if (r.rowCount === 0) return res.status(401).json({ error: "invalid credentials" });

    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // return token and minimal user info
    return res.json({ token, user: { id: user.id, email, username: user.username || null } });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "server error" });
  }
};