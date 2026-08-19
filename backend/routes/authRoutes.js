import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 📌 User Registration API
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, address, password, role } = req.body;

    // Validate inputs
    if (!name || !email || !phone || !address || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, phone, address, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({ message: "✅ Registration successful!", token, user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "❌ Server error during registration" });
  }
});

// 📌 User Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "✅ Login successful!", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "❌ Server error during login" });
  }
});

// 📌 Route to get the current authenticated user's profile from MongoDB
router.get("/me", async (req, res) => {
  try {
    let token = req.header("Authorization");
    let userId = null;

    if (token && token !== "undefined" && token !== "null" && token !== "Bearer undefined" && token !== "Bearer null") {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7);
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        userId = decoded.id;
      } catch (err) {
        console.warn("⚠️ Token verification failed, using email query fallback");
      }
    }

    let user;
    if (userId) {
      user = await User.findById(userId).select("-password");
    } else if (req.query.email) {
      user = await User.findOne({ email: req.query.email }).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("❌ Error fetching current user:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// 📌 Route to update the authenticated user's profile in MongoDB
router.put("/profile", async (req, res) => {
  try {
    let token = req.header("Authorization");
    let userId = null;

    if (token && token !== "undefined" && token !== "null" && token !== "Bearer undefined" && token !== "Bearer null") {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7);
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        userId = decoded.id;
      } catch (err) {
        console.warn("⚠️ Token verification failed, using email update fallback");
      }
    }

    const updateData = { ...req.body };
    delete updateData.password;

    let updatedUser;
    if (userId) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password");
    } else if (req.body.email) {
      updatedUser = await User.findOneAndUpdate(
        { email: req.body.email },
        { $set: updateData },
        { new: true }
      ).select("-password");
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error during profile update" });
  }
});

export default router;
