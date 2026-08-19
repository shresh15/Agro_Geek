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
        <h1 className="text-4xl font-bold text-center text-green-900">
          Seller's Arena
        </h1>

        <div className="max-w-2xl mx-auto bg-white p-6 mt-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Upload the entities</h2>
          {/* 🔹 Category Selection Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black
             dark:border-gray-700 border-gray-300 rounded-lg w-full 
             focus:ring-2 focus:ring-green-900 transition
              transform hover:scale-105 duration-300 mb-3"
          >
            <option value="">Select a category</option>
            <option value="fallen_leaves">Fallen Leaves</option>
            <option value="wood">Wood</option>
            <option value="medicinal_plants">
              Medicinal Plants (Ayurvedic)
            </option>
          </select>
          {formErrors.category && (
            <p className="text-red-500 text-sm mb-4">{formErrors.category}</p>
          )}

          {/* 🔹 Waste Sub-type Detail (Conditional for Ayurvedic Plants) */}
          {category === "medicinal_plants" && (
            <>
              <input
                type="text"
                placeholder="Specific Plant Name (e.g. Neem, Tulsi, Ashwagandha)"
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
              />
              {formErrors.subType && (
                <p className="text-red-500 text-sm mb-4">{formErrors.subType}</p>
              )}
            </>
          )}

          {/* 🔹 Moisture / Dryness Level Dropdown */}
          <select
            value={moistureLevel}
            onChange={(e) => setMoistureLevel(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
          >
            <option value="">Select Moisture Level</option>
            <option value="Dry">Dry</option>
            <option value="Semi-dry">Semi-dry</option>
            <option value="Wet">Wet</option>
          </select>
          {formErrors.moistureLevel && (
            <p className="text-red-500 text-sm mb-4">{formErrors.moistureLevel}</p>
          )}
          {/* 🔹 Entity Name Input */}
          <input
            type="text"
            placeholder="Entity Name"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black
             dark:border-gray-700 border-gray-300 rounded-lg w-full 
             focus:ring-2 focus:ring-green-900 transition
              transform hover:scale-105 duration-300 mb-3"
          />
          {formErrors.entityName && (
            <p className="text-red-500 text-sm mb-4">{formErrors.entityName}</p>
          )}
          {/* 🔹 Amount Input */}
          <input
            type="text"
            placeholder="Amount (kg, gm)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black
             dark:border-gray-700 border-gray-300 rounded-lg w-full 
             focus:ring-2 focus:ring-green-900 transition
              transform hover:scale-105 duration-300 mb-3"
          />
          {formErrors.amount && (
            <p className="text-red-500 text-sm mb-4">{formErrors.amount}</p>
          )}
          {/* 🔹 Price per kg Input */}
          <input
            type="text"
            placeholder="Price per kg"
            value={pricePerAmount}
            onChange={(e) => setPricePerAmount(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
          />
          {formErrors.pricePerAmount && (
            <p className="text-red-500 text-sm mb-4">
              {formErrors.pricePerAmount}
            </p>
          )}

          {/* 🔹 Pricing Negotiable Checkbox */}
          <div className="flex items-center gap-2 mb-3 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-lg border border-slate-200/60">
            <input
              type="checkbox"
              id="isNegotiable"
              checked={isNegotiable}
              onChange={(e) => setIsNegotiable(e.target.checked)}
              className="h-4.5 w-4.5 accent-green-800 rounded border-gray-300 focus:ring-green-900 cursor-pointer"
            />
            <label htmlFor="isNegotiable" className="text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer select-none">
              Is this price negotiable? (Toggle for bidding/negotiation)
            </label>
          </div>

          {/* 🔹 Current Location Input */}
          <div className="flex flex-row items-center mb-4">
            <input
              type="text"
              placeholder="Current Location"
              value={location}
              readOnly
              className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
            />
            <button
              onClick={getlocation}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 font-semibold ml-2 h-12"
              disabled={isLoading}
            >
              {isLoading ? "Fetching..." : "Get Location"}
            </button>
          </div>
          {formErrors.location && (
            <p className="text-red-500 text-sm mb-4">{formErrors.location}</p>
          )}

          {/* 🔹 Delivery Days Input */}
          <input
            type="text"
            placeholder="Number of days for delivery"
            value={deliveryDays}
            onChange={(e) => setDeliveryDays(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
          />
          {formErrors.deliveryDays && (
            <p className="text-red-500 text-sm mb-4">
              {formErrors.deliveryDays}
            </p>
          )}

          {/* 🔹 Logistics Section */}
          <h3 className="text-lg font-bold text-green-900 mt-4 mb-3 border-b pb-1 dark:text-emerald-400">Logistics & Packaging</h3>

          {/* 🔹 Pickup Availability Dropdown */}
          <select
            value={pickupAvailability}
            onChange={(e) => setPickupAvailability(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
          >
            <option value="">Select Pickup Availability</option>
            <option value="Seller delivers">Seller delivers</option>
            <option value="Buyer must pick up">Buyer must pick up</option>
            <option value="Either">Either</option>
          </select>
          {formErrors.pickupAvailability && (
            <p className="text-red-500 text-sm mb-4">{formErrors.pickupAvailability}</p>
          )}

          {/* 🔹 Minimum Order Quantity (MOQ) */}
          <input
            type="text"
            placeholder="Minimum Order Quantity (in kg)"
            value={minOrderQuantity}
            onChange={(e) => setMinOrderQuantity(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
          />
          {formErrors.minOrderQuantity && (
            <p className="text-red-500 text-sm mb-4">{formErrors.minOrderQuantity}</p>
          )}

          {/* 🔹 Packaging Type Dropdown */}
          <select
            value={packagingType}
            onChange={(e) => setPackagingType(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
          >
            <option value="">Select Packaging Type</option>
            <option value="loose">loose</option>
            <option value="sacks">sacks</option>
            <option value="bales">bales</option>
          </select>
          {formErrors.packagingType && (
            <p className="text-red-500 text-sm mb-4">{formErrors.packagingType}</p>
          )}

          {/* 🔹 Seller Trust Section */}
          <h3 className="text-lg font-bold text-green-900 mt-4 mb-3 border-b pb-1 dark:text-emerald-400">Seller Profile & Contact</h3>

          {/* 🔹 Seller Profile Type Dropdown */}
          <select
            value={sellerType}
            onChange={(e) => setSellerType(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
          >
            <option value="">Select Seller Profile Type</option>
            <option value="Individual farmer">Individual farmer</option>
            <option value="Vendor">Vendor</option>
            <option value="Business">Business</option>
          </select>
          {formErrors.sellerType && (
            <p className="text-red-500 text-sm mb-4">{formErrors.sellerType}</p>
          )}

          {/* 🔹 Contact Number Input */}
          <input
            type="text"
            placeholder="Contact Number (10 digits)"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
          />
          {formErrors.contactNumber && (
            <p className="text-red-500 text-sm mb-4">{formErrors.contactNumber}</p>
          )}

          {/* 🔹 Aadhar Card Number Input */}
          <input
            type="text"
            placeholder="Aadhar Card Number"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
          />
          {formErrors.aadharNumber && (
            <p className="text-red-500 text-sm mb-4">
              {formErrors.aadharNumber}
            </p>
          )}
          {/* 🔹 Contamination Self-Declaration Checkbox */}
          <div className="flex items-center gap-2 mb-4 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 dark:bg-slate-900/50 dark:border-gray-800">
            <input
              type="checkbox"
              id="contaminationFree"
              checked={isContaminationFree}
              onChange={(e) => setIsContaminationFree(e.target.checked)}
              className="h-5 w-5 accent-green-800 rounded border-gray-300 focus:ring-green-900 cursor-pointer"
            />
            <label htmlFor="contaminationFree" className="text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer select-none">
              Self-Declaration: This batch is free from plastic, synthetic materials, or other contaminants.
            </label>
          </div>
          {/* 🔹 Image Upload Input */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="border p-3 shadow-md bg-white dark:text-black
             dark:border-gray-700 border-gray-300 rounded-lg w-full 
             focus:ring-2 focus:ring-green-900 transition
              transform hover:scale-105 duration-300 mb-3"
            disabled={!category}
          />
          {formErrors.images && (
            <p className="text-red-500 text-sm mb-4">{formErrors.images}</p>
          )}
          {/* 🔹 Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {images.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`Leaf ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md shadow"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* 🔹 Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-500"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Farmer;
