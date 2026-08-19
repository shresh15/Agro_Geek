import React, { useState, useEffect } from "react";
import axios from "axios";
import bgnew from "../assets/bgnew.jpg";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_ENV_BACKEND_URL || "http://localhost:8000";

const Company = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category
  const [submissions, setSubmissions] = useState([]); // Store fetched products
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Company Profile states
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [compName, setCompName] = useState("");
  const [indType, setIndType] = useState("");
  const [gstinNumber, setGstinNumber] = useState("");
  const [cpName, setCpName] = useState("");
  const [cpPhone, setCpPhone] = useState("");
  const [cpEmail, setCpEmail] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [preferredCats, setPreferredCats] = useState([]);
  const [capacity, setCapacity] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radiusLimit, setRadiusLimit] = useState(50);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("profileImage");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // Calculate distance between two coordinates in km (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return parseFloat(d.toFixed(1));
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail") || "";
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/me?email=${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.success && response.data?.user) {
        const u = response.data.user;
        setUserProfile(u);
        
        // Auto-complete check
        if (!u.companyName || !u.gstin || !u.industryType) {
          setShowProfileModal(true);
          setCompName(u.companyName || u.name || "");
          setCpName(u.name || "");
          setCpPhone(u.phone || "");
          setCpEmail(u.email || "");
          setRegAddress(u.address || "");
        } else {
          setCompName(u.companyName);
          setIndType(u.industryType);
          setGstinNumber(u.gstin);
          setCpName(u.contactPersonName || u.name || "");
          setCpPhone(u.phone || "");
          setCpEmail(u.email || "");
          setRegAddress(u.registeredAddress || u.address || "");
          setPreferredCats(u.preferredCategories || []);
          setCapacity(u.processingCapacity || "");
          setLat(u.latitude || "");
          setLng(u.longitude || "");
          setRadiusLimit(u.maxRadius || 50);

          if (u.preferredCategories?.[0]) {
            setSelectedCategory(u.preferredCategories[0]);
          }
        }
      }
    } catch (err) {
      console.error("❌ Error fetching buyer profile:", err);
    }
  };

  const handleSaveProfile = async () => {
    if (!compName || !indType || !gstinNumber || !cpName || !cpPhone || !cpEmail || !regAddress || !lat || !lng) {
      alert("⚠️ All fields (including Geolocation) are required to verify your B2B profile.");
      return;
    }

    setIsSavingProfile(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/auth/profile`,
        {
          companyName: compName,
          industryType: indType,
          gstin: gstinNumber,
          contactPersonName: cpName,
          phone: cpPhone,
          email: cpEmail,
          registeredAddress: regAddress,
          preferredCategories: preferredCats,
          processingCapacity: capacity,
          latitude: Number(lat),
          longitude: Number(lng),
          maxRadius: Number(radiusLimit),
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data?.success) {
        alert("✅ B2B Profile updated successfully!");
        setUserProfile(response.data.user);
        setShowProfileModal(false);
        if (preferredCats?.[0]) {
          setSelectedCategory(preferredCats[0]);
        } else {
          setSelectedCategory("fallen_leaves");
        }
      }
    } catch (err) {
      console.error("❌ Error saving profile:", err);
      alert("❌ Failed to save profile details.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const getBuyerLocation = () => {
    if (!navigator.geolocation) {
      alert("⚠️ Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(6));
        setLng(position.coords.longitude.toFixed(6));
      },
      (error) => {
        alert("⚠️ Location lookup failed. Please enter coordinates manually.");
      }
    );
  };

  useEffect(() => {
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedProfileImage) {
      setProfilePic(storedProfileImage);
    }
    fetchUserProfile();
  }, []);

  // Fetch submissions when category is selected
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "select") {
      fetchSubmissions(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchSubmissions = async (category) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/farmer/submissions?category=${category}`
      );

      if (response.data && Array.isArray(response.data.data)) {
        setSubmissions(response.data.data);
      } else {
        setSubmissions([]);
        setError("Invalid response format.");
      }
    } catch (error) {
      setError(
        `Error fetching data: ${error.response?.data?.message || error.message}`
      );
    }
    setLoading(false);
  };

  // Filter submissions by distance and category preferences
  const getFilteredSubmissions = () => {
    return submissions.filter((item) => {
      if (lat && lng && item.location) {
        const parts = item.location.split(",");
        if (parts.length === 2) {
          const sLat = parseFloat(parts[0]);
          const sLng = parseFloat(parts[1]);
          if (!isNaN(sLat) && !isNaN(sLng)) {
            const distance = calculateDistance(Number(lat), Number(lng), sLat, sLng);
            item.computedDistance = distance;
            if (radiusLimit && distance > Number(radiusLimit)) {
              return false;
            }
          }
        }
      }
      return true;
    });
  };

  // Function to handle interest
  const handleInterestClick = async (submissionId) => {
    if (!userProfile) {
      alert("⚠️ Please log in to indicate interest.");
      return;
    }

    const companyDetails = {
      companyName: userProfile.companyName || userProfile.name || "ABC Industries",
      contact: userProfile.phone || "9876543210",
      email: userProfile.email || "abc@example.com",
      location: userProfile.registeredAddress || userProfile.address || "Kolkata, India",
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/farmer/notify-farmer`,
        {
          submissionId,
          companyDetails,
        }
      );

      if (response.data.success) {
        alert("✅ Interest sent successfully! B2B profile shared.");
      } else {
        alert("Failed to send interest.");
      }
    } catch (error) {
      alert("Error sending interest.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-b from-[#052F17] via-[#A3D9C9] to-[#FAF9F6]"
    >
      <div className="flex flex-col justify-center items-center w-full">
        <Navbar
          profilePicture={profilePic}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          handleLogout={handleLogout}
        />

        {/* 🔹 Location & Search Radius Selector Panel */}
        <div className="bg-white/95 backdrop-blur shadow-md rounded-2xl p-6 mt-6 mb-6 max-w-4xl mx-auto w-[90vw] flex flex-col md:flex-row gap-5 items-center justify-between border border-emerald-100/50">
          <div className="flex flex-col text-left">
            <span className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider">Your Operating Location</span>
            <div className="flex gap-2 items-center mt-1.5">
              <span className="text-sm font-semibold text-slate-700">
                {lat && lng ? `📍 ${lat}, ${lng}` : "⚠️ Location Not Set"}
              </span>
              <button
                onClick={getBuyerLocation}
                className="bg-emerald-100 hover:bg-emerald-250 text-emerald-950 text-xs px-2.5 py-1.5 rounded-lg font-bold transition duration-200 border border-emerald-200"
              >
                Get GPS Coordinates
              </button>
            </div>
            {/* Manual Coordinates Override */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="border rounded-lg text-xs p-1.5 w-24 text-black border-slate-200 focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="border rounded-lg text-xs p-1.5 w-24 text-black border-slate-200 focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col text-left w-full md:w-auto">
            <label className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider mb-1.5">Search Radius Limit</label>
            <select
              value={radiusLimit}
              onChange={(e) => setRadiusLimit(e.target.value)}
              className="border p-2.5 rounded-lg text-sm bg-white text-slate-800 font-bold border-slate-250 focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-none cursor-pointer"
            >
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
              <option value="100">Within 100 km</option>
              <option value="999999">No Limit (Custom)</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowProfileModal(true)}
            className="bg-emerald-800 hover:bg-emerald-750 text-white font-extrabold text-sm px-5 py-3 rounded-xl transition shadow-md duration-200"
          >
            Edit B2B Profile
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="w-[90vw] h-[12vh] flex flex-col justify-center items-center mb-4">
          <label htmlFor="options" className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider mb-2">
            Please Select The Category Of Purchase
          </label>
          <select
            id="options"
            className="p-3 border border-slate-250 rounded-xl shadow-sm w-72 text-center text-slate-800 bg-white font-bold focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="select">Select Option</option>
            <option value="fallen_leaves">Fallen Leaves</option>
            <option value="ayurvedic">Ayurvedic Plants</option>
            <option value="wood">Woods</option>
          </select>
        </div>

        {/* Product Details Section */}
        <div className="w-full max-w-6xl mx-auto px-6 pb-12">
          {loading && <p className="text-center text-lg font-semibold text-emerald-900">Loading listings...</p>}
          {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

          {getFilteredSubmissions().length === 0 &&
            !loading &&
            selectedCategory !== "select" && (
              <p className="text-center text-lg font-semibold text-slate-500 py-12">
                No listings found within your preferred categories or search radius limit.
              </p>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredSubmissions().map((submission) => (
              <div
                key={submission._id}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  {/* Display Image */}
                  {submission.imagePaths?.[0] && (
                    <img
                      src={`${BACKEND_URL}/${submission.imagePaths[0]}`}
                      alt={submission.entityName}
                      className="w-full h-48 object-cover rounded-lg mb-4 shadow"
                    />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {submission.entityName}
                    </h3>
                  </div>

                  {submission.computedDistance !== undefined && (
                    <p className="text-emerald-700 font-extrabold text-xs mb-3 bg-emerald-50 py-1.5 px-3 rounded-lg inline-block border border-emerald-100">
                      📍 {submission.computedDistance} km away
                    </p>
                  )}

                  <div className="flex flex-col gap-1.5 text-sm text-slate-600">
                    <p>
                      <strong>Amount:</strong> {submission.amount}
                    </p>
                    <p>
                      <strong>Price per kg:</strong> {submission.pricePerAmount} {submission.isNegotiable ? "💸 (Negotiable)" : "🔒 (Fixed)"}
                    </p>
                    <p>
                      <strong>Location:</strong> {submission.location}
                    </p>
                    <p>
                      <strong>Address:</strong> {submission.address || "N/A"}
                    </p>
                    <p>
                      <strong>Delivery Days:</strong> {submission.deliveryDays}
                    </p>
                    <p>
                      <strong>Moisture Level:</strong> {submission.moistureLevel || "N/A"}
                    </p>
                    <p>
                      <strong>Purity:</strong> {submission.isContaminationFree ? "✅ Free from plastic/synthetic material" : "⚠️ Not self-declared"}
                    </p>
                    {submission.subType && (
                      <p>
                        <strong>Botanical Specie:</strong> {submission.subType}
                      </p>
                    )}
                    <p>
                      <strong>Packaging:</strong> {submission.packagingType || "N/A"}
                    </p>
                    <p>
                      <strong>Min Order Qty (MOQ):</strong> {submission.minOrderQuantity ? `${submission.minOrderQuantity} kg` : "N/A"}
                    </p>
                    <p>
                      <strong>Logistics:</strong> {submission.pickupAvailability || "N/A"}
                    </p>
                    <p>
                      <strong>Seller Profile:</strong> {submission.sellerType || "Individual farmer"}
                    </p>
                    <p>
                      <strong>Contact:</strong> {submission.contactNumber || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Interest Button */}
                <button
                  onClick={() => handleInterestClick(submission._id)}
                  className="mt-6 w-full bg-green-700 text-white font-bold py-2.5 rounded-lg hover:bg-green-600 transition shadow"
                >
                  Yes, I am Interested
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Company/Buyer Profile Data Modal (One-time or Edit) */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-fade-in my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-emerald-50/50">
              <div className="text-left">
                <h3 className="text-xl font-bold text-green-950">Verify B2B Profile Details</h3>
                <p className="text-xs text-slate-500">Fill in your business details to complete registration</p>
              </div>
              {userProfile?.companyName && (
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="h-8 w-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-4 text-left">
              {/* General Info */}
              <h4 className="text-sm font-bold text-green-800 border-b pb-1">1. Business Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="border p-2.5 rounded-lg w-full text-black border-gray-300"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Industry Type</label>
                  <select
                    value={indType}
                    onChange={(e) => setIndType(e.target.value)}
                    className="border p-2.5 rounded-lg w-full text-black bg-white border-gray-300"
                  >
                    <option value="">Select industry</option>
                    <option value="Fertilizer manufacturer">Fertilizer manufacturer</option>
                    <option value="Manure processor">Manure processor</option>
                    <option value="Composting unit">Composting unit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={gstinNumber}
                    onChange={(e) => setGstinNumber(e.target.value)}
                    className="border p-2.5 rounded-lg w-full text-black border-gray-300"
                    placeholder="15-digit GSTIN"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Daily Processing Capacity</label>
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="border p-2.5 rounded-lg w-full text-black border-gray-300"
                    placeholder="e.g. 500kg/day"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <h4 className="text-sm font-bold text-green-800 border-b pb-1 mt-2">2. Contact Person</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={cpName}
                    onChange={(e) => setCpName(e.target.value)}
                    className="border p-2.5 rounded-lg w-full text-black border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Phone</label>
                  <input
                    type="text"
                    value={cpPhone}
                    onChange={(e) => setCpPhone(e.target.value)}
                    className="border p-2.5 rounded-lg w-full text-black border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email</label>
                  <input
                    type="email"
                    value={cpEmail}
                    onChange={(e) => setCpEmail(e.target.value)}
                    className="border p-2.5 rounded-lg w-full text-black border-gray-300"
                  />
                </div>
              </div>

              {/* Registered Address */}
              <h4 className="text-sm font-bold text-green-800 border-b pb-1 mt-2">3. Address & Operating Location</h4>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Registered Address (for invoicing)</label>
                <textarea
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  rows={2}
                  className="border p-2.5 rounded-lg w-full text-black resize-none border-gray-300"
                  placeholder="Street, City, Pin Code"
                />
              </div>

              {/* Geolocation Coordinates */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Operating Geolocation coordinates</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="border p-2.5 rounded-lg w-[30%] text-black border-gray-300 focus:ring-1 focus:ring-green-800 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="border p-2.5 rounded-lg w-[30%] text-black border-gray-300 focus:ring-1 focus:ring-green-800 text-sm"
                  />
                  <button
                    type="button"
                    onClick={getBuyerLocation}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition shrink-0"
                  >
                    Get GPS Location
                  </button>
                </div>
              </div>

              {/* Waste Preferences */}
              <h4 className="text-sm font-bold text-green-800 border-b pb-1 mt-2">4. Preferences</h4>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Preferred Waste Categories (Multi-select)</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "fallen_leaves", name: "Fallen Leaves" },
                    { id: "wood", name: "Wood residues" },
                    { id: "medicinal_plants", name: "Ayurvedic Residues" },
                  ].map((cat) => (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer text-sm font-medium transition ${
                        preferredCats.includes(cat.id)
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={preferredCats.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPreferredCats([...preferredCats, cat.id]);
                          } else {
                            setPreferredCats(preferredCats.filter((id) => id !== cat.id));
                          }
                        }}
                        className="hidden"
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              {userProfile?.companyName && (
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-350 font-bold hover:bg-slate-100 transition text-slate-700"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-lg transition"
              >
                {isSavingProfile ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;
