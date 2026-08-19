import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import imageone from "/src/assets/bg.jpg";
import Navbar from "./Navbar";
import "/src/pages/details.css";
const BACKEND_URL = import.meta.env.VITE_ENV_BACKEND_URL || "http://localhost:8000";

const Farmer = () => {
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [category, setCategory] = useState("");
  const [entityName, setEntityName] = useState("");
  const [amount, setAmount] = useState("");
  const [pricePerAmount, setPricePerAmount] = useState("");
  const [location, setlocation] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [locationError, setLocationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [moistureLevel, setMoistureLevel] = useState("");
  const [isContaminationFree, setIsContaminationFree] = useState(false);
  const [subType, setSubType] = useState("");
  const [pickupAvailability, setPickupAvailability] = useState("");
  const [minOrderQuantity, setMinOrderQuantity] = useState("");
  const [packagingType, setPackagingType] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [sellerType, setSellerType] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedProfileImage) {
      setProfilePicture(storedProfileImage);
    }
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("profileImage");
    localStorage.removeItem("authToken");
    alert("✅ Logout Successfully!");
    navigate("/");
  };

  // ✅ Handle Image Upload & Preview
  const handleImageUpload = (event) => {
    if (!category) {
      alert("⚠️ Please select a category before uploading images!");
      return;
    }

    const files = Array.from(event.target.files);
    if (files.length + imageFiles.length > 5) {
      alert("⚠️ You can upload a maximum of 5 images.");
      return;
    }

    const newImageURLs = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImageURLs]);
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // ✅ Delete Image Before Submission
  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  // ✅ Get Current Location
  const getlocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setlocation(`${latitude}, ${longitude}`);
        setLocationError(""); // Clear any previous error
        setIsLoading(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location.");
        console.error("❌ Geolocation error:", error);
        setIsLoading(false);
      }
    );
  };

  // ✅ Validate Form
  const validateForm = () => {
    const errors = {};
    if (!category) errors.category = "Please select a category.";
    if (category === "medicinal_plants" && !subType)
      errors.subType = "Please specify the plant name.";
    if (!moistureLevel) errors.moistureLevel = "Please select a moisture level.";
    if (!pickupAvailability) errors.pickupAvailability = "Please select pickup availability.";
    if (!minOrderQuantity || isNaN(minOrderQuantity) || Number(minOrderQuantity) < 0)
      errors.minOrderQuantity = "Please enter a valid minimum order quantity.";
    if (!packagingType) errors.packagingType = "Please select a packaging type.";
    if (!sellerType) errors.sellerType = "Please select your seller profile type.";
    if (!contactNumber || !/^\d{10}$/.test(contactNumber))
      errors.contactNumber = "Please enter a valid 10-digit contact number.";
    if (!address) errors.address = "Please enter your full address.";
    if (!entityName) errors.entityName = "Please enter an entity name.";
    if (!amount || isNaN(amount))
      errors.amount = "Please enter a valid amount.";
    if (!pricePerAmount || isNaN(pricePerAmount))
      errors.pricePerAmount = "Please enter a valid price.";
    if (!location) errors.location = "Please fetch your location.";
    if (!deliveryDays || isNaN(deliveryDays))
      errors.deliveryDays = "Please enter a valid number of days.";
    if (!aadharNumber || !/^\d{12}$/.test(aadharNumber))
      errors.aadharNumber = "Please enter a valid 12-digit Aadhar number.";
    if (imageFiles.length === 0)
      errors.images = "Please upload at least one image.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Submit Data to Backend
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("entityName", entityName);
    formData.append("amount", amount);
    formData.append("pricePerAmount", pricePerAmount);
    formData.append("location", location);
    formData.append("deliveryDays", deliveryDays);
    formData.append("aadharNumber", aadharNumber);
    formData.append("category", category);
    formData.append("moistureLevel", moistureLevel);
    formData.append("isContaminationFree", isContaminationFree);
    formData.append("pickupAvailability", pickupAvailability);
    formData.append("minOrderQuantity", minOrderQuantity);
    formData.append("packagingType", packagingType);
    formData.append("isNegotiable", isNegotiable);
    formData.append("sellerType", sellerType);
    formData.append("contactNumber", contactNumber);
    formData.append("address", address);
    if (category === "medicinal_plants") {
      formData.append("subType", subType);
    }

    // Append images
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/farmer/submit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("✅ Data submitted successfully!");
      console.log("Server response:", response.data);

      // Reset form
      setEntityName("");
      setAmount("");
      setPricePerAmount("");
      setlocation("");
      setDeliveryDays("");
      setAadharNumber("");
      setCategory("");
      setMoistureLevel("");
      setIsContaminationFree(false);
      setSubType("");
      setPickupAvailability("");
      setMinOrderQuantity("");
      setPackagingType("");
      setIsNegotiable(false);
      setSellerType("");
      setContactNumber("");
      setAddress("");
      setImages([]);
      setImageFiles([]);
      setFormErrors({});
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("❌ Data submission failed.");
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-auto h-[calc(100vh-120px)] overflow-y-auto" // Allow scrolling
      style={{
        backgroundImage: `url(${imageone})`,
        backgroundAttachment: "scroll",
      }}
    >
      {/* 🔹 Navbar */}
      <Navbar
        profilePicture={profilePicture}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        handleLogout={handleLogout}
      />

      {/* 🔹 Scrollable Content Container */}
      <div className="pt-4 pb-8">
        <div className="max-w-6xl mx-auto bg-white p-8 mt-6 shadow-xl rounded-2xl border border-slate-100">
          <h2 className="text-3xl font-extrabold text-green-955 mb-6 pb-2 border-b text-center md:text-left dark:text-green-900">Upload Your Agricultural Batches</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 🔹 COLUMN 1: Material Details */}
            <div className="flex flex-col gap-1 text-left">
              <h3 className="text-lg font-bold text-green-800 mb-3 pb-1 border-b border-emerald-50">1. Material Details</h3>
              
              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              >
                <option value="">Select a category</option>
                <option value="fallen_leaves">Fallen Leaves</option>
                <option value="wood">Wood</option>
                <option value="medicinal_plants">Medicinal Plants (Ayurvedic)</option>
              </select>
              {formErrors.category && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.category}</p>
              )}

              {category === "medicinal_plants" && (
                <>
                  <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Botanical/Plant Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Neem, Tulsi, Ashwagandha"
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
                  />
                  {formErrors.subType && (
                    <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.subType}</p>
                  )}
                </>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Moisture Level</label>
              <select
                value={moistureLevel}
                onChange={(e) => setMoistureLevel(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              >
                <option value="">Select Moisture Level</option>
                <option value="Dry">Dry</option>
                <option value="Semi-dry">Semi-dry</option>
                <option value="Wet">Wet</option>
              </select>
              {formErrors.moistureLevel && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.moistureLevel}</p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Batch Title (Entity Name)</label>
              <input
                type="text"
                placeholder="e.g. Dried Tulsi Leaves Batch A"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.entityName && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.entityName}</p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Available Quantity (in kg)</label>
              <input
                type="text"
                placeholder="Amount (e.g. 50)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.amount && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.amount}</p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Price per kg</label>
              <input
                type="text"
                placeholder="Price in INR"
                value={pricePerAmount}
                onChange={(e) => setPricePerAmount(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.pricePerAmount && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.pricePerAmount}</p>
              )}

              <div className="flex items-center gap-2 mt-1 mb-3 bg-slate-50 dark:bg-slate-900/35 p-2 rounded-lg border border-slate-200/50">
                <input
                  type="checkbox"
                  id="isNegotiable"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="h-4.5 w-4.5 accent-green-800 rounded border-gray-300 focus:ring-green-900 cursor-pointer"
                />
                <label htmlFor="isNegotiable" className="text-xs text-slate-600 dark:text-slate-300 font-semibold cursor-pointer select-none">
                  Price is negotiable (open to bids)
                </label>
              </div>
            </div>

            {/* 🔹 COLUMN 2: Logistics & Location */}
            <div className="flex flex-col gap-1 text-left">
              <h3 className="text-lg font-bold text-green-800 mb-3 pb-1 border-b border-emerald-50">2. Logistics & Location</h3>
              
              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Sellers Location</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Coordinates"
                  value={location}
                  readOnly
                  className="border p-3 shadow-sm bg-slate-50 dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900"
                />
                <button
                  onClick={getlocation}
                  className="bg-green-700 text-white px-3 py-2 rounded-lg hover:bg-green-600 font-semibold text-xs transition duration-200 h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "Fetching..." : "Fetch"}
                </button>
              </div>
              {formErrors.location && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.location}</p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Full Physical Address</label>
              <textarea
                placeholder="Enter complete address (State, District, PIN)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3 resize-none"
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.address}</p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Delivery Lead Time</label>
              <input
                type="text"
                placeholder="Number of days (e.g. 5)"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.deliveryDays && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.deliveryDays}</p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Pickup Availability</label>
              <select
                value={pickupAvailability}
                onChange={(e) => setPickupAvailability(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              >
                <option value="">Select Option</option>
                <option value="Seller delivers">Seller delivers</option>
                <option value="Buyer must pick up">Buyer must pick up</option>
                <option value="Either">Either</option>
              </select>
              {formErrors.pickupAvailability && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.pickupAvailability}</p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Minimum Order Qty (MOQ in kg)</label>
              <input
                type="text"
                placeholder="Min kg required for purchase"
                value={minOrderQuantity}
                onChange={(e) => setMinOrderQuantity(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.minOrderQuantity && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.minOrderQuantity}</p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Packaging Format</label>
              <select
                value={packagingType}
                onChange={(e) => setPackagingType(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              >
                <option value="">Select Packaging Type</option>
                <option value="loose">loose</option>
                <option value="sacks">sacks</option>
                <option value="bales">bales</option>
              </select>
              {formErrors.packagingType && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.packagingType}</p>
              )}
            </div>

            {/* 🔹 COLUMN 3: Seller Profile & Security */}
            <div className="flex flex-col gap-1 text-left">
              <h3 className="text-lg font-bold text-green-800 mb-3 pb-1 border-b border-emerald-50">3. Seller & Verification</h3>
              
              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Seller Type</label>
              <select
                value={sellerType}
                onChange={(e) => setSellerType(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              >
                <option value="">Select Seller Type</option>
                <option value="Individual farmer">Individual farmer</option>
                <option value="Vendor">Vendor</option>
                <option value="Business">Business</option>
              </select>
              {formErrors.sellerType && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.sellerType}</p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Direct Contact Number</label>
              <input
                type="text"
                placeholder="10-digit Mobile Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.contactNumber && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.contactNumber}</p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Aadhar Card Number</label>
              <input
                type="text"
                placeholder="12-digit Number"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.aadharNumber && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.aadharNumber}</p>
              )}

              <div className="flex items-start gap-2 mt-1 mb-3 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 dark:bg-slate-900/30 dark:border-gray-800">
                <input
                  type="checkbox"
                  id="contaminationFree"
                  checked={isContaminationFree}
                  onChange={(e) => setIsContaminationFree(e.target.checked)}
                  className="h-4.5 w-4.5 accent-green-800 rounded border-gray-300 focus:ring-green-900 cursor-pointer mt-0.5"
                />
                <label htmlFor="contaminationFree" className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold cursor-pointer select-none leading-tight">
                  Declarative: Batch is clean and contains no plastic/synthetic contamination.
                </label>
              </div>

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Showcase Pictures (max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="border p-2.5 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3 text-xs"
                disabled={!category}
              />
              {formErrors.images && (
                <p className="text-red-500 text-xs mb-3 font-semibold">{formErrors.images}</p>
              )}

              {/* Showcase Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {images.map((src, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-slate-200">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow font-bold hover:bg-red-500 animate-fade-in"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 🔹 SUBMIT ACTION */}
          <button
            onClick={handleSubmit}
            className="w-full mt-8 bg-green-700 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-green-900/10 transition-all duration-200 text-lg tracking-wide animate-pulse-slow"
          >
            Submit Batch Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default Farmer;
