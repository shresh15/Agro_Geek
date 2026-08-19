import express from "express";
import Data from "../models/Data.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

// 📌 Route to handle farmer data submission
router.post("/submit", upload.array("images", 5), async (req, res) => {
  try {
    const {
      entityName,
      amount,
      pricePerAmount,
      location,
      deliveryDays,
      aadharNumber,
      category,
      moistureLevel,
      isContaminationFree,
      subType,
      pickupAvailability,
      minOrderQuantity,
      packagingType,
      isNegotiable,
      sellerType,
      contactNumber,
      address,
      sellerEmail,
    } = req.body;

    // Validate inputs
    if (
      !entityName ||
      !amount ||
      !pricePerAmount ||
      !location ||
      !deliveryDays ||
      !aadharNumber ||
      !category
    ) {
      res
        .status(400)
        .json({ message: "All fields are required", body: req.body });
      return;
    }

    // Get image paths (if any)
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    // Create new data entry
    const newData = new Data({
      entityName,
      amount,
      pricePerAmount,
      location,
      deliveryDays,
      aadharNumber,
      category,
      imagePaths, // Save image paths in the database
      moistureLevel,
      isContaminationFree: isContaminationFree === "true" || isContaminationFree === true,
      subType,
      pickupAvailability,
      minOrderQuantity: Number(minOrderQuantity) || 0,
      packagingType,
      isNegotiable: isNegotiable === "true" || isNegotiable === true,
      sellerType,
      contactNumber,
      address,
      sellerEmail,
    });

    // Save to MongoDB
    await newData.save();

    res
      .status(201)
      .json({ message: "✅ Data submitted successfully!", data: newData });
  } catch (error) {
    console.error("❌ Error submitting data:", error);
    if (error instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ message: "File upload error: " + error.message });
    }
    res.status(500).json({ message: "❌ Server error during data submission" });
  }
});

// 📌 Route to fetch farmer data based on category
router.get("/submissions", async (req, res) => {
  try {
    const { category } = req.query; // Get category from query params

    if (!category) {
      return res
        .status(400)
        .json({ message: "Category is required for fetching data" });
    }

    const submissions = await Data.find({ category });

    if (submissions.length === 0) {
      return res.status(404).json({ message: "No submissions found" });
    }

    res.status(200).json({ message: "✅ Submissions Fetched", data: submissions });
  } catch (error) {
    console.error("❌ Error fetching submissions:", error);
    res.status(500).json({ message: "❌ Server error during data retrieval" });
  }
});

// 📌 Route to fetch all data submitted by a specific seller (by email or contact number)
router.get("/my-submissions", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Seller email is required" });
    }

    // Retrieve user profile to find their registered phone number
    const user = await User.findOne({ email });
    let queryConditions = [{ sellerEmail: email }];

    if (user && user.phone) {
      queryConditions.push({ contactNumber: user.phone });
    }

    const submissions = await Data.find({
      $or: queryConditions
    });

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    console.error("❌ Error fetching seller submissions:", error);
    res.status(500).json({ message: "❌ Server error during data retrieval" });
  }
});

// 📌 Route to notify farmer about company interest
router.post("/notify-farmer", async (req, res) => {
  try {
    const { submissionId, companyDetails } = req.body;

    // Validate inputs
    if (!submissionId || !companyDetails) {
      return res
        .status(400)
        .json({ message: "submissionId and companyDetails are required" });
    }

    // Validate companyDetails
    if (
      !companyDetails.companyName ||
      !companyDetails.contact ||
      !companyDetails.email ||
      !companyDetails.location
    ) {
      return res.status(400).json({
        message: "All company details (name, contact, email, location) are required",
      });
    }

    // Find the submission by ID
    const submission = await Data.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Add company interest to the submission
    submission.companyInterests = submission.companyInterests || [];
    submission.companyInterests.push({
      companyName: companyDetails.companyName,
      contact: companyDetails.contact,
      email: companyDetails.email,
      location: companyDetails.location,
      notifiedAt: new Date(),
    });

    // Save the updated submission
    await submission.save();

    res.status(200).json({
      success: true,
      message: "✅ Farmer notified successfully",
      data: submission,
    });
  } catch (error) {
    console.error("❌ Error notifying farmer:", error);
    res.status(500).json({ message: "❌ Server error during notification" });
  }
});

export default router;
