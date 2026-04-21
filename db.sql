-- Run this in psql or pgAdmin to set up the database

CREATE DATABASE rotect_db;

\c rotect_db

CREATE TABLE admin (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE siswa (
  id         SERIAL PRIMARY KEY,
  nama       VARCHAR(100) NOT NULL,
  nis        VARCHAR(20) UNIQUE NOT NULL,
  kelas      VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hasil_tes (
  id              SERIAL PRIMARY KEY,
  id_siswa        INT NOT NULL REFERENCES siswa(id) ON DELETE CASCADE,
  nilai_sensor    INT NOT NULL,
  kategori        VARCHAR(20) NOT NULL,
  waktu_pengujian TIMESTAMP DEFAULT NOW()
);

-- Default admin: username=admin password=rotech123
-- (run db:seed or insert manually after hashing)
