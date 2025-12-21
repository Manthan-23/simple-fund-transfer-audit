import express from "express";
import { Router } from "express";
import pool from "./connectDB.js";
import router from "./routes/route.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false
  })
);

app.use(express.json());

const PORT = 9090;

app.use("/api", router);






app.get("/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json({ status: "ok", db: "Connected", result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", db: "Not Connected" });
    }
});




app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});