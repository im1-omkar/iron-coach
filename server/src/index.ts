const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const auth = require("./api/auth/index")

import type { Request, Response } from "express";


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

//testing purpose
app.get("/health", (_req : Request, res: Response) => res.json({ ok: true }));

app.use("/api/auth", auth);
app.use("/api/chat", (req : Request, res : Response) => res.status(501).json({ error: "chat not implemented" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));