import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["fallen_leaves", "wood", "medicinal_plants"],
      required: true,
    },
    entityName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    amount: {
      type: Number, // Changed to Number for numerical operations
      required: true,
      min: 0, // Ensure amount is non-negative
    },
    pricePerAmount: {
      type: Number, // Changed to Number for numerical operations
      required: true,
      min: 0, // Ensure price is non-negative
    },
    deliveryDays: {
      type: Number, // Changed to Number for numerical operations
      required: true,
      min: 1, // Ensure at least 1 day
    },
    aadharNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v); // Ensure exactly 12 digits
        },
        message: (props) => `${props.value} is not a valid Aadhar number!`,
      },
    },
    location: {
      type: String,
      required: true,
    },
    moistureLevel: {
      type: String,
      enum: ["Dry", "Semi-dry", "Wet"],
      required: false,
    },
    isContaminationFree: {
      type: Boolean,
      default: false,
    },
    subType: {
      type: String,
      required: false,
    },
    pickupAvailability: {
      type: String,
      enum: ["Seller delivers", "Buyer must pick up", "Either"],
      required: false,
    },
    minOrderQuantity: {
      type: Number,
      min: 0,
      required: false,
    },
    packagingType: {
      type: String,
      enum: ["loose", "sacks", "bales"],
      required: false,
    },
    isNegotiable: {
      type: Boolean,
      default: false,
    },
    sellerType: {
      type: String,
      enum: ["Individual farmer", "Vendor", "Business"],
      required: false,
    },
    contactNumber: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    sellerEmail: {
      type: String,
      required: false,
    },
    imagePaths: {
      type: [String],
      default: [],
    },
    companyInterests: [
      {
        companyName: String,
        contact: String,
        email: String,
        location: String,
        notifiedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
dataSchema.index({ aadharNumber: 1 });
dataSchema.index({ entityName: 1 });

const Data = mongoose.model("Data", dataSchema);
export default Data;
