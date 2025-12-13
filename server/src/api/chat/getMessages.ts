const verifyToken = require("../../middlewares/verifyToken");
const { query } = require("../../db/client");

/**
 * Handler function to get all messages for authenticated user
 */
async function getMessages(req: any, res: any) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const result = await query(
      "SELECT id, user_id, content, created_at FROM messages WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return res.json({ messages: result.rows });
  } catch (err) {
    console.error("getMessages error:", err);
    return res.status(500).json({ error: "server error" });
  }
}

module.exports = { getMessages, verifyToken };
