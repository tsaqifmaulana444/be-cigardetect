import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute     from "./routes/auth.js";
import studentRoute  from "./routes/students.js";
import testRoute     from "./routes/test.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth",     authRoute);
app.use("/api/students", studentRoute);
app.use("/api/test",     testRoute);
app.use("/api",          testRoute); // covers /api/history/:id

app.listen(3001, () => console.log("Server Running At Port 3001"));
