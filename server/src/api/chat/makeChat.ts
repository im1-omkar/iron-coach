const { Router } = require("express");
const { getMessages, verifyToken } = require("./getMessages");

const router = Router();

// POST /chat/make - create a chat (placeholder)
router.post("/make", verifyToken, async (req: any, res: any) => {
  // Placeholder for actual makeChat logic
  res.status(501).json({ error: "makeChat not implemented yet" });
});

// GET /chat/messages - get messages for authenticated user
router.get("/messages", verifyToken, getMessages);

module.exports = router;
