import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

// POST /api/test — dari ESP32, tanpa auth
router.post("/", async (req, res) => {

  const { id_siswa, nilai_sensor, kategori } = req.body;

  if (!id_siswa || nilai_sensor === undefined || !kategori) {
    return res.status(400).json({
      message: "id_siswa, nilai_sensor, dan kategori wajib diisi."
    });
  }

  const siswa = await pool.query(
    "SELECT id FROM siswa WHERE id = $1",
    [id_siswa]
  );

  if (!siswa.rows[0]) {
    return res.status(404).json({
      message: "Siswa tidak ditemukan."
    });
  }

  const result = await pool.query(
    `INSERT INTO hasil_tes 
    (id_siswa, nilai_sensor, kategori) 
    VALUES ($1, $2, $3)
    RETURNING *`,
    [id_siswa, nilai_sensor, kategori]
  );

  res.status(201).json(result.rows[0]);
});

// GET /api/test — hasil minggu ini
router.get("/", authMiddleware, async (req, res) => {
  const result = await pool.query(`
    SELECT h.*, s.nama, s.nis, s.kelas
    FROM hasil_tes h
    JOIN siswa s ON h.id_siswa = s.id
    WHERE h.waktu_pengujian >= NOW() - INTERVAL '7 days'
    ORDER BY h.waktu_pengujian DESC
  `);
  res.json(result.rows);
});

// GET /api/test/all — semua hasil tes
router.get("/all", authMiddleware, async (req, res) => {
  const result = await pool.query(`
    SELECT h.*, s.nama, s.nis, s.kelas
    FROM hasil_tes h
    JOIN siswa s ON h.id_siswa = s.id
    ORDER BY h.waktu_pengujian DESC
  `);
  res.json(result.rows);
});

// GET /api/history/:id — riwayat per siswa
router.get("/history/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const siswa = await pool.query("SELECT * FROM siswa WHERE id = $1", [id]);
  if (!siswa.rows[0]) return res.status(404).json({ message: "Siswa tidak ditemukan." });

  const history = await pool.query(
    "SELECT * FROM hasil_tes WHERE id_siswa = $1 ORDER BY waktu_pengujian DESC",
    [id]
  );
  res.json({ siswa: siswa.rows[0], history: history.rows });
});

export default router;
