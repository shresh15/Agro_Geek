import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import Data from "./models/Data.js"; // Import the Data schema
import farmerRouter from "./routes/farmerRouter.js";
dotenv.config();
const app = express();

// Get correct directory path (ES Module compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Apply Middleware
const whitelistedOrigins = (
  process.env.WHITELISTED_FRONTEND_URLS ||
  process.env.WHITELISTED_FRONTEND_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whitelistedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin is not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json()); // Parse JSON body
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(express.urlencoded({ extended: true })); // Parse form data

// ✅ Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir)); // Serve uploaded images

// ✅ Apply authentication routes
app.use("/api/auth", authRoutes);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ Setup Multer for Image Uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."),
      false,
    );
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, fileFilter });

app.use("/api/farmer", farmerRouter);
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: "❌ Server error." });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
