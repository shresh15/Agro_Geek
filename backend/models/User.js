import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String, // "farmer" or "company"
  phone: String,
  address: String,
  companyName: String,
  industryType: {
    type: String,
    enum: ["Fertilizer manufacturer", "Manure processor", "Composting unit", "Other"],
  },
  gstin: String,
  contactPersonName: String,
  registeredAddress: String,
  preferredCategories: [String],
  processingCapacity: String,
  latitude: Number,
  longitude: Number,
  maxRadius: {
    type: Number,
    default: 50, // default radius 50km
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
