// server/src/api/auth/signup.ts
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { query } = require("../../db/client");

module.exports = async function signup(req: any, res: any) {
  try {
    const { email, username, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "missing email or password" });

    // check existing
    const exists = await query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rowCount > 0) return res.status(409).json({ error: "email already used" });

    const password_hash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    await query(
      "INSERT INTO users(id, email, username, password_hash, created_at) VALUES($1,$2,$3,$4, now())",
      [id, email, username || null, password_hash]
    );

    // return minimal user (do not return password)
    return res.status(201).json({ id, email, username: username || null });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ error: "server error" });
  }
};
