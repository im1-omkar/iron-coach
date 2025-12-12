const {Router} = require("express");
const signup = require("./signup");
const login = require("./login");
const verifyToken = require("./verifyToken");

import type { Request, Response } from "express";

const router = Router();

router.post("/signup", signup);
router.post("/login",login);

module.exports = router;