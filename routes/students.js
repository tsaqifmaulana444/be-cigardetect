import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

// GET /api/students
router.get("/", authMiddleware, async (req, res) => {
  const result = await pool.query("SELECT * FROM siswa ORDER BY nama ASC");
  res.json(result.rows);
});

// GET /api/students/:id
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM siswa WHERE id = $1", [id]);
  if (!result.rows[0]) return res.status(404).json({ message: "Siswa tidak ditemukan." });
  res.json(result.rows[0]);
});

// POST /api/students
router.post("/", authMiddleware, async (req, res) => {
  const { nama, nis, kelas } = req.body;
  if (!nama || !nis || !kelas)
    return res.status(400).json({ message: "Nama, NIS, dan kelas wajib diisi." });

  const exists = await pool.query("SELECT id FROM siswa WHERE nis = $1", [nis]);
  if (exists.rows[0]) return res.status(409).json({ message: "NIS sudah terdaftar." });

  const result = await pool.query(
    "INSERT INTO siswa (nama, nis, kelas) VALUES ($1, $2, $3) RETURNING *",
    [nama, nis, kelas]
  );
  res.status(201).json(result.rows[0]);
});

// PUT /api/students/:id
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nama, nis, kelas } = req.body;

  const exists = await pool.query("SELECT id FROM siswa WHERE id = $1", [id]);
  if (!exists.rows[0]) return res.status(404).json({ message: "Siswa tidak ditemukan." });

  const result = await pool.query(
    "UPDATE siswa SET nama = $1, nis = $2, kelas = $3 WHERE id = $4 RETURNING *",
    [nama, nis, kelas, id]
  );
  res.json(result.rows[0]);
});

// DELETE /api/students/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const exists = await pool.query("SELECT id FROM siswa WHERE id = $1", [id]);
  if (!exists.rows[0]) return res.status(404).json({ message: "Siswa tidak ditemukan." });

  await pool.query("DELETE FROM siswa WHERE id = $1", [id]);
  res.json({ message: "Siswa berhasil dihapus." });
});

export default router;
