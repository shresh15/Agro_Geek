import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import imageone from "/src/assets/bg.jpg";
import Navbar from "./Navbar";
import "/src/pages/details.css";
const BACKEND_URL =
  import.meta.env.VITE_ENV_BACKEND_URL || "http://localhost:8000";

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
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyListings, setHistoryListings] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showBuyersModal, setShowBuyersModal] = useState(false);
  const [buyersList, setBuyersList] = useState([]);
  const [isLoadingBuyers, setIsLoadingBuyers] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          withCredentials: true,
        });
        if (response.data?.success && response.data?.user) {
          if (response.data.user.phone)
            setContactNumber(response.data.user.phone);
          if (response.data.user.address)
            setAddress(response.data.user.address);
        }
      } catch (error) {
        console.error("❌ Error fetching user profile from MongoDB:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // ✅ Fetch history submissions for the logged in seller
  const handleOpenHistory = async () => {
    setShowHistoryModal(true);

    setIsLoadingHistory(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/farmer/my-submissions`,
        { withCredentials: true },
      );
      setHistoryListings(response.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching history listings:", error);
      alert("❌ Failed to fetch your listing history.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // ✅ Fetch potential buyers matching the seller's active email
  const handleOpenPotentialBuyers = async () => {
    setShowBuyersModal(true);
    setIsLoadingBuyers(true);

    const emailToQuery = userEmail || localStorage.getItem("userEmail") || "";
    if (!emailToQuery) {
      setBuyersList([]);
      setIsLoadingBuyers(false);
      return;
    }

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/farmer/my-submissions?email=${emailToQuery}`,
        { withCredentials: true },
      );
      const myItems = response.data.data || [];

      // Extract all company interest list records and map to target products
      const collectedInterests = [];
      myItems.forEach((item) => {
        if (item.companyInterests && item.companyInterests.length > 0) {
          item.companyInterests.forEach((interest) => {
            collectedInterests.push({
              ...interest,
              itemName: item.entityName,
              itemCategory: item.category,
              itemQuantity: item.amount,
              itemPrice: item.pricePerAmount,
            });
          });
        }
      });

      // Sort by notified date (descending)
      collectedInterests.sort(
        (a, b) => new Date(b.notifiedAt) - new Date(a.notifiedAt),
      );
      setBuyersList(collectedInterests);
    } catch (error) {
      console.error("❌ Error fetching potential buyers:", error);
    } finally {
      setIsLoadingBuyers(false);
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    axios
      .post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true })
      .finally(() => navigate("/"));
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
      },
    );
  };

  // ✅ Validate Form
  const validateForm = () => {
    const errors = {};
    if (!category) errors.category = "Please select a category.";
    if (category === "medicinal_plants" && !subType)
      errors.subType = "Please specify the plant name.";
    if (!moistureLevel)
      errors.moistureLevel = "Please select a moisture level.";
    if (!pickupAvailability)
      errors.pickupAvailability = "Please select pickup availability.";
    if (
      !minOrderQuantity ||
      isNaN(minOrderQuantity) ||
      Number(minOrderQuantity) < 0
    )
      errors.minOrderQuantity = "Please enter a valid minimum order quantity.";
    if (!packagingType)
      errors.packagingType = "Please select a packaging type.";
    if (!sellerType)
      errors.sellerType = "Please select your seller profile type.";
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
          withCredentials: true,
        },
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
        onMyListingsClick={handleOpenHistory}
        onPotentialBuyersClick={handleOpenPotentialBuyers}
      />

      {/* 🔹 Scrollable Content Container */}
      <div className="pt-4 pb-8">
        <div className="max-w-6xl mx-auto bg-white p-8 mt-6 shadow-xl rounded-2xl border border-slate-100">
          <h2 className="text-3xl font-extrabold text-green-955 mb-6 pb-2 border-b text-center md:text-left dark:text-green-900">
            Upload Your Agricultural Batches
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 🔹 COLUMN 1: Material Details */}
            <div className="flex flex-col gap-1 text-left">
              <h3 className="text-lg font-bold text-green-800 mb-3 pb-1 border-b border-emerald-50">
                1. Material Details
              </h3>

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              >
                <option value="">Select a category</option>
                <option value="fallen_leaves">Fallen Leaves</option>
                <option value="wood">Wood</option>
                <option value="medicinal_plants">
                  Medicinal Plants (Ayurvedic)
                </option>
              </select>
              {formErrors.category && (
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.category}
                </p>
              )}

              {category === "medicinal_plants" && (
                <>
                  <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Botanical/Plant Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Neem, Tulsi, Ashwagandha"
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
                  />
                  {formErrors.subType && (
                    <p className="text-red-500 text-xs mb-3 font-semibold">
                      {formErrors.subType}
                    </p>
                  )}
                </>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Moisture Level
              </label>
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
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.moistureLevel}
                </p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Batch Title (Entity Name)
              </label>
              <input
                type="text"
                placeholder="e.g. Dried Tulsi Leaves Batch A"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.entityName && (
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.entityName}
                </p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Available Quantity (in kg)
              </label>
              <input
                type="text"
                placeholder="Amount (e.g. 50)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.amount && (
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.amount}
                </p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Price per kg
              </label>
              <input
                type="text"
                placeholder="Price in INR"
                value={pricePerAmount}
                onChange={(e) => setPricePerAmount(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.pricePerAmount && (
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.pricePerAmount}
                </p>
              )}

              <div className="flex items-center gap-2 mt-1 mb-3 bg-slate-50 dark:bg-slate-900/35 p-2 rounded-lg border border-slate-200/50">
                <input
                  type="checkbox"
                  id="isNegotiable"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="h-4.5 w-4.5 accent-green-800 rounded border-gray-300 focus:ring-green-900 cursor-pointer"
                />
                <label
                  htmlFor="isNegotiable"
                  className="text-xs text-slate-600 dark:text-slate-300 font-semibold cursor-pointer select-none"
                >
                  Price is negotiable (open to bids)
                </label>
              </div>
            </div>

            {/* 🔹 COLUMN 2: Logistics & Location */}
            <div className="flex flex-col gap-1 text-left">
              <h3 className="text-lg font-bold text-green-800 mb-3 pb-1 border-b border-emerald-50">
                2. Logistics & Location
              </h3>

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Sellers Location
              </label>
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
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.location}
                </p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Full Physical Address
              </label>
              <textarea
                placeholder="Enter complete address (State, District, PIN)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3 resize-none"
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.address}
                </p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Delivery Lead Time
              </label>
              <input
                type="text"
                placeholder="Number of days (e.g. 5)"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.deliveryDays && (
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.deliveryDays}
                </p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Pickup Availability
              </label>
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
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.pickupAvailability}
                </p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Minimum Order Qty (MOQ in kg)
              </label>
              <input
                type="text"
                placeholder="Min kg required for purchase"
                value={minOrderQuantity}
                onChange={(e) => setMinOrderQuantity(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.minOrderQuantity && (
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.minOrderQuantity}
                </p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Packaging Format
              </label>
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
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.packagingType}
                </p>
              )}
            </div>

            {/* 🔹 COLUMN 3: Seller Profile & Security */}
            <div className="flex flex-col gap-1 text-left">
              <h3 className="text-lg font-bold text-green-800 mb-3 pb-1 border-b border-emerald-50">
                3. Seller & Verification
              </h3>

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Seller Type
              </label>
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
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.sellerType}
                </p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Direct Contact Number
              </label>
              <input
                type="text"
                placeholder="10-digit Mobile Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.contactNumber && (
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.contactNumber}
                </p>
              )}

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Aadhar Card Number
              </label>
              <input
                type="text"
                placeholder="12-digit Number"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                className="border p-3 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3"
              />
              {formErrors.aadharNumber && (
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.aadharNumber}
                </p>
              )}

              <div className="flex items-start gap-2 mt-1 mb-3 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 dark:bg-slate-900/30 dark:border-gray-800">
                <input
                  type="checkbox"
                  id="contaminationFree"
                  checked={isContaminationFree}
                  onChange={(e) => setIsContaminationFree(e.target.checked)}
                  className="h-4.5 w-4.5 accent-green-800 rounded border-gray-300 focus:ring-green-900 cursor-pointer mt-0.5"
                />
                <label
                  htmlFor="contaminationFree"
                  className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold cursor-pointer select-none leading-tight"
                >
                  Declarative: Batch is clean and contains no plastic/synthetic
                  contamination.
                </label>
              </div>

              <label className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Showcase Pictures (max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="border p-2.5 shadow-sm bg-white dark:text-black dark:border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 mb-3 text-xs"
                disabled={!category}
              />
              {formErrors.images && (
                <p className="text-red-500 text-xs mb-3 font-semibold">
                  {formErrors.images}
                </p>
              )}

              {/* Showcase Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {images.map((src, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-md overflow-hidden border border-slate-200"
                    >
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

      {/* 🔹 My Listings History Overlay Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white/95 dark:bg-slate-900/95 max-w-4xl w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Your Listed Batches
                </h3>
                <p className="text-xs text-slate-500">
                  History of entries submitted from your account
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="h-9 w-9 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-800 mb-3"></div>
                  <p className="text-sm text-slate-500">
                    Retrieving your submissions...
                  </p>
                </div>
              ) : historyListings.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl">🌾</span>
                  <p className="text-slate-500 mt-2 font-medium">
                    You haven't listed any items yet.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Submit your first batch using the form behind this panel.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {historyListings.map((item) => (
                    <div
                      key={item._id}
                      className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/50 flex flex-col gap-3"
                    >
                      {/* Display Image (using backend base URL) */}
                      {item.imagePaths?.[0] ? (
                        <img
                          src={`${BACKEND_URL}/${item.imagePaths[0]}`}
                          alt={item.entityName}
                          className="w-full h-36 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-36 bg-slate-100 flex items-center justify-center rounded-lg text-slate-400">
                          No Images Uploaded
                        </div>
                      )}

                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] uppercase font-bold text-green-700 tracking-wider">
                          {item.category.replace("_", " ")}
                        </span>
                        <h4 className="font-bold text-slate-950 text-base leading-tight">
                          {item.entityName}
                        </h4>
                        {item.subType && (
                          <span className="text-xs text-slate-600 font-semibold italic">
                            Specie: {item.subType}
                          </span>
                        )}

                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 border-t pt-2 text-xs text-slate-600">
                          <div>
                            <strong>Qty:</strong> {item.amount} kg
                          </div>
                          <div>
                            <strong>Price:</strong> ₹{item.pricePerAmount}/kg
                          </div>
                          <div>
                            <strong>Moisture:</strong>{" "}
                            {item.moistureLevel || "N/A"}
                          </div>
                          <div>
                            <strong>Packaging:</strong>{" "}
                            {item.packagingType || "N/A"}
                          </div>
                          <div>
                            <strong>MOQ:</strong> {item.minOrderQuantity || 0}{" "}
                            kg
                          </div>
                          <div>
                            <strong>Lead Time:</strong> {item.deliveryDays} Days
                          </div>
                        </div>

                        <div className="mt-2 text-[10px] text-slate-400 text-right">
                          Listed on:{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 🔹 Potential Buyers Modal */}
      {showBuyersModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white/95 dark:bg-slate-900/95 max-w-4xl w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Potential Buyers
                </h3>
                <p className="text-xs text-slate-500">
                  Corporate leads interested in purchasing your listed batches
                </p>
              </div>
              <button
                onClick={() => setShowBuyersModal(false)}
                className="h-9 w-9 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full flex items-center justify-center font-bold text-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingBuyers ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-850 mb-3"></div>
                  <p className="text-sm text-slate-500">
                    Retrieving interested buyers...
                  </p>
                </div>
              ) : buyersList.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl">💼</span>
                  <p className="text-slate-500 mt-2 font-medium">
                    No company leads yet.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Once a verified buyer clicks "I am Interested" on any of
                    your batches, their details will display here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {buyersList.map((interest, idx) => (
                    <div
                      key={idx}
                      className="bg-emerald-50/40 dark:bg-slate-800/30 p-5 rounded-xl border border-emerald-100 dark:border-slate-800 flex flex-col justify-between gap-4 text-left"
                    >
                      <div>
                        {/* Target Item Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-850 dark:text-emerald-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                            Interested In: {interest.itemName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {interest.notifiedAt
                              ? new Date(
                                  interest.notifiedAt,
                                ).toLocaleDateString()
                              : ""}
                          </span>
                        </div>

                        {/* Company Details */}
                        <h4 className="font-extrabold text-lg text-slate-950 dark:text-white leading-snug">
                          🏢 {interest.companyName}
                        </h4>

                        <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <div>
                            <strong>Contact Name:</strong>{" "}
                            {interest.contact || "N/A"}
                          </div>
                          <div>
                            <strong>Email ID:</strong> {interest.email || "N/A"}
                          </div>
                          <div>
                            <strong>HQ Location:</strong>{" "}
                            {interest.location || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Call-to-action buttons */}
                      <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <a
                          href={`mailto:${interest.email}?subject=Regarding your interest in my ${interest.itemName} listing`}
                          className="flex-1 text-center bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition duration-200"
                        >
                          Send Email
                        </a>
                        {interest.contact && (
                          <a
                            href={`tel:${interest.contact}`}
                            className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-850 font-bold py-2 rounded-lg text-xs transition duration-200 border border-slate-200"
                          >
                            Call Buyer
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farmer;
