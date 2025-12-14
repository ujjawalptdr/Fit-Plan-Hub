import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* CORS CONFIG */
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true
}));

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
