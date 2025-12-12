// server/src/api/auth/verifyToken.ts
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

/**
 * Attaches req.userId if token valid
 */
module.exports = function verifyToken(req: any, res: any, next: any) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "no auth" });
    const token = auth.replace("Bearer ", "");
    const payload: any = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
};
