const { Router } = require("express");
const verifyToken = require("../../middlewares/verifyToken");
const { getMessages } = require("./getMessages");
const makeChat = require("./makeChat");

const router = Router();

// POST /chat/makeChat
router.post("/makeChat", verifyToken, makeChat);

// GET /chat/getMessages
router.get("/getMessages", verifyToken, getMessages);

module.exports = router;
