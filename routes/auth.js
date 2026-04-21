import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username dan password wajib diisi." });

  const result = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
  const admin  = result.rows[0];

  if (!admin)
    return res.status(401).json({ message: "Username atau password salah." });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid)
    return res.status(401).json({ message: "Username atau password salah." });

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, admin: { id: admin.id, username: admin.username } });
});

export default router;
