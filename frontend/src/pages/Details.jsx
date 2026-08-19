import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import bgimg from "../assets/bg.jpg";
import "./details.css";
const CLOUD_PRESET = import.meta.env.VITE_CLOUD_PRESET;
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const BACKEND_URL = (
  import.meta.env.VITE_ENV_BACKEND_URL ||
  (import.meta.env.DEV ? "http://localhost:8000" : "")
).replace(/\/$/, "");

const Details = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = new URLSearchParams(location.search).get("role");

  const [isLogin, setIsLogin] = useState(true); // Start with Login first
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: role || "farmer", // Default to "farmer"
    image: "", // To store Cloudinary image URL
  });

  const [loading, setLoading] = useState(false); // For image upload
  const [submitting, setSubmitting] = useState(false); // For form submission

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", CLOUD_PRESET);
    imageData.append("cloud_name", CLOUD_NAME);

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: imageData },
      );

      const data = await response.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        alert("Image uploaded successfully!");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (Login/Signup)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && (!formData.name || !formData.phone || !formData.address)) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!formData.email || !formData.password) {
      alert("Please enter email and password.");
      return;
    }
    const submissionData =
      !isLogin && !formData.image
        ? {
            ...formData,
            image:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          }
        : formData;

    setSubmitting(true);
    try {
      if (isLogin) {
        // Login API Call
        const loginResponse = await axios.post(
          `${BACKEND_URL}/api/auth/login`,
          submissionData,
        );
        console.log("Login Response:", loginResponse.data);
        alert("Login Successful!");
        navigate(role === "farmer" ? "/Farmer" : "/Company");
      } else {
        // Signup API Call
        const signupResponse = await axios.post(
          `${BACKEND_URL}/api/auth/register`,
          submissionData,
        );
        console.log("Signup Response:", signupResponse.data);
        alert("Registration Successful!");
        localStorage.setItem("profileImage", submissionData.image);
        navigate(role === "farmer" ? "/Farmer" : "/Company");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        (error.request
          ? "Unable to reach the backend. Make sure it is running on port 8000."
          : error.message);
      alert(`${isLogin ? "Login" : "Registration"} failed. ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-gray-300"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-4xl font-bold mb-4 text-black">
        {isLogin
          ? "Login"
          : `Complete Your Registration as ${
              role === "farmer" ? "Seller" : "Company Owner"
            }`}
      </h1>

      <div className="max-h-[90vh] overflow-y-auto w-96">
        <form
          onSubmit={handleSubmit}
          className="divback p-7 rounded-xl shadow-md w-full border border-black mt-5"
        >
          {/* Signup Fields */}
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="border p-3 shadow-md bg-white dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="border p-3 shadow-md text-black dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300 mb-3"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="mb-3 border p-3 shadow-md text-black dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300"
                required
              />
            </>
          )}

          {/* Email & Password Fields */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="mb-3 border p-3 shadow-md text-black dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="mb-3 border p-3 shadow-md text-black dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300"
            required
          />

          {/* Image Upload for Signup */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block font-bold mb-2">
                Upload Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className=" border p-3 shadow-md text-black dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300"
                required
              />
              {loading && (
                <p className="text-sm text-gray-500">Uploading image...</p>
              )}
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Profile Preview"
                  className="border p-3 shadow-md text-black dark:text-black dark:border-gray-700 border-gray-300 rounded-lg w-full max-h-48 object-contain focus:ring-2 focus:ring-green-900 transition transform hover:scale-105 duration-300"
                  required
                />
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-900 text-black py-2 rounded-lg mt-4 hover:bg-green-300 hover:text-black"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : isLogin ? "Login" : "Submit"}
          </button>
        </form>
      </div>

      {/* Toggle Signup/Login */}
      <p className="mt-4 text-black">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          className="text-green-900 font-semibold cursor-pointer hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Signup" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default Details;
